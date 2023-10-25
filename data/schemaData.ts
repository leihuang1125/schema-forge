export const schemaData = { 
    "@context": {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "worksFor": "http://example.org/worksFor",
    "manufactures": "http://example.org/manufactures"
},
"@graph": [
    {
        "@id": "Employee",
        "@type": "rdfs:Class",
        "rdfs:label": "Employee"
    },
    {
        "@id": "Company",
        "@type": "rdfs:Class",
        "rdfs:label": "Company"
    },
    {
        "@id": "Product",
        "@type": "rdfs:Class",
        "rdfs:label": "Product"
    },
    {
        "@type": "rdf:Property",
        "rdfs:label": "worksFor",
        "rdfs:domain": "Employee",
        "rdfs:range": "Company"
    },
    {
        "@type": "rdf:Property",
        "rdfs:label": "manufactures",
        "rdfs:domain": "Company",
        "rdfs:range": "Product"
    }
] };