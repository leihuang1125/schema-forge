import React, { FC } from 'react';
import * as $rdf from 'rdflib';

type DataLoadingProps = {
  setStore: React.Dispatch<React.SetStateAction<$rdf.IndexedFormula | null>>;
};

const DataLoading: FC<DataLoadingProps> = ({ setStore }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const fileType = file?.name.split('.').pop()?.toLowerCase();

    if (!file || !fileType) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileContent = e.target!.result as string;
      const store = $rdf.graph();

      try {
        // Parse Turtle or JSON-LD file to rdflib store
        if (fileType === 'jsonld') {
          $rdf.parse(fileContent, store, 'http://example.com', 'application/ld+json');
        } else if (fileType === 'ttl') {
          $rdf.parse(fileContent, store, 'http://example.com', 'text/turtle');
        } else {
          console.error('Unsupported file type');
          return;
        }
        
        // Set the populated store in the parent component
        setStore(store);
      } catch (error) {
        console.error("Failed to parse schema data:", error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <label htmlFor="schemaFile">Upload a new schema:</label>
      <input
        type="file"
        id="schemaFile"
        name="schemaFile"
        accept=".jsonld,.ttl"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default DataLoading;
