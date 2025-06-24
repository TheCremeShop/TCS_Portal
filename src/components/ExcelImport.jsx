import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';
import { UploadCloud, FileSpreadsheet, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const gridColumns = [
  { key: 'productId', label: 'Product ID' },
  { key: 'customerId', label: 'Customer ID' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'notes', label: 'Notes' },
];

export const ExcelImport = ({ open, onOpenChange, onImport }) => {
  const [file, setFile] = useState(null);
  const [sheetData, setSheetData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const { toast } = useToast();

  const resetState = () => {
    setFile(null);
    setSheetData([]);
    setHeaders([]);
    setColumnMapping({});
  };

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length > 0) {
            setHeaders(jsonData[0]);
            setSheetData(jsonData.slice(1));
          } else {
            toast({ title: 'Empty Sheet', description: 'The selected Excel sheet is empty.', variant: 'destructive' });
          }
        } catch (error) {
          toast({ title: 'Error Reading File', description: 'Could not process the Excel file.', variant: 'destructive' });
          resetState();
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  }, [toast]);

  const handleMappingChange = (gridCol, excelCol) => {
    setColumnMapping(prev => ({ ...prev, [gridCol]: excelCol }));
  };

  const handleImport = () => {
    if (Object.keys(columnMapping).length === 0) {
      toast({ title: 'No Columns Mapped', description: 'Please map at least one column to import data.', variant: 'destructive' });
      return;
    }

    const importedData = sheetData.map((row, index) => {
      const newRow = { id: `imported_${Date.now()}_${index}` };
      gridColumns.forEach(gridCol => {
        const mappedExcelCol = columnMapping[gridCol.key];
        if (mappedExcelCol) {
          const excelColIndex = headers.indexOf(mappedExcelCol);
          newRow[gridCol.key] = row[excelColIndex] || '';
        } else {
          newRow[gridCol.key] = '';
        }
      });
      return newRow;
    });

    onImport(importedData);
    onOpenChange(false);
    resetState();
    toast({ title: 'Import Successful', description: 'Data has been imported into the grid.' });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) resetState(); onOpenChange(isOpen); }}>
      <DialogContent className="glass-effect border-white/20 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import from Excel</DialogTitle>
          <DialogDescription className="text-slate-300">
            Upload an Excel file, map columns, and import data into your grid.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {!file ? (
            <div className="flex justify-center items-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-700/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-slate-500">XLSX, XLS, or CSV</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".xlsx, .xls, .csv"/>
              </label>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-lg border border-slate-600 mb-6">
                <FileSpreadsheet className="w-8 h-8 text-green-400" />
                <div>
                  <p className="font-medium text-white">{file.name}</p>
                  <p className="text-xs text-slate-400">{headers.length} columns and {sheetData.length} rows found.</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4 text-white">Map Columns</h3>
              <p className="text-sm text-slate-300 mb-4">Match your Excel sheet columns to the grid columns.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gridColumns.map(gridCol => (
                  <div key={gridCol.key} className="flex items-center space-x-4">
                    <Label className="w-1/3 text-right text-slate-300">{gridCol.label}</Label>
                    <ArrowRight className="text-slate-500" />
                    <Select onValueChange={value => handleMappingChange(gridCol.key, value)}>
                      <SelectTrigger className="w-full bg-slate-800/50 border-slate-600">
                        <SelectValue placeholder="Select Excel Column" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 text-white border-slate-600">
                        <SelectItem value="none">_skip_</SelectItem>
                        {headers.map(header => (
                          <SelectItem key={header} value={header}>{header}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-600">Cancel</Button>
          <Button onClick={handleImport} disabled={!file || sheetData.length === 0} className="bg-blue-600 hover:bg-blue-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};