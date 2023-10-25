import React, { useEffect, useRef } from 'react';
//import * as joint from 'jointjs';
import { dia, ui, shapes } from '@clientio/rappid';
import * as $rdf from 'rdflib';
import * as rdfHelpers from '@/components/rdfHelpers';
import { createDiskAndLink } from '@/components/graph';

function removeTooltip() {
    const oldTooltip = document.getElementById("tooltip");
        if (oldTooltip) {
            oldTooltip.remove();
        }
}

type DiagramProps = {
  selectedClass?: string;
  store: $rdf.IndexedFormula | null;
  setTableData: (data: { [key: string]: string }) => void;
}

    const Diagram: React.FC<DiagramProps> = ({ selectedClass, store, setTableData }) => {
        let currentDisk: shapes.standard.Circle | null = null;
        let createdRelatedDisks: string[] = [];
        let createdDiskById: { [id: string]: string } = {};
        let lastClickedClass: string | null = null;

        const canvas = useRef(null);

    useEffect(() => {
      const graph = new dia.Graph();
      const paper = new dia.Paper({
        model: graph,
        gridSize: 1,
      //   background: {
      //     color: '#F8F9FA',
      // },
      frozen: true,
      async: true,
      sorting: dia.Paper.sorting.APPROX,
      cellViewNamespace: shapes
  });

      const scroller = new ui.PaperScroller({
        paper,
        autoResizePaper: true,
        cursor: 'grab',
        
    });

    canvas.current.appendChild(scroller.el);
    scroller.lock();
    scroller.render().center();

    paper.on('blank:mousewheel', (evt, ox, oy, delta) => {
      evt.preventDefault();
      scroller.zoom(delta * 0.2, { min: 0.4, max: 3, grid: 0.2, ox, oy });
    });

    paper.on('blank:pointerdown', (event, x, y) => {
      removeTooltip();
      scroller.startPanning(event);
    });
    
    // Clear existing cells and previously created related disks
    graph.clear();
    createdRelatedDisks = [];

    if (selectedClass) {
      const disk = new shapes.standard.Circle({
        size: { width: 100, height: 100 },
        attrs: {
          label: {
            text: rdfHelpers.getLabelFromURI(store, selectedClass),
            fontSize: 14
          }
        }
      });
      graph.addCell(disk);
      paper.unfreeze();
      currentDisk = disk;
      createdDiskById[disk.id] = selectedClass;

      const paperWidth = paper.options.width as number;
      const paperHeight = paper.options.height as number;
      disk.position((paperWidth - disk.attributes.size.width) / 2, (paperHeight - disk.attributes.size.height) / 2);
    
      const showTooltip = (e: MouseEvent, data: { [key: string]: string }) => {      
        const tooltip = document.createElement("div");
        tooltip.id = "tooltip";
        tooltip.style.position = "fixed";
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;

        // Tailwind styling
        tooltip.classList.add("bg-white", "bg-opacity-90", "rounded-lg", "shadow-lg", "p-4", "border", "border-gray-300");
        // Creating a table for a more structured look
        const table = document.createElement("table");
        table.classList.add("min-w-full");

        const tbody = document.createElement("tbody");

        Object.keys(data).forEach((key) => {
          const tr = document.createElement("tr");
          tr.classList.add("hover:bg-gray-100");

          const tdKey = document.createElement("td");
          tdKey.classList.add("py-1", "px-2", "text-left");
          tdKey.textContent = key;

          const tdValue = document.createElement("td");
          tdValue.classList.add("py-1", "px-2", "text-left");
          tdValue.textContent = data[key];

          tr.appendChild(tdKey);
          tr.appendChild(tdValue);
          tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        tooltip.appendChild(table);
        document.body.appendChild(tooltip);
      };

    paper.on('cell:pointerdown', function(cellView, evt) {
        const clickedDiskId = cellView.model.id;
        const clickedClass = createdDiskById[clickedDiskId];
        removeTooltip();
        graph.removeCells(graph.getElements().filter(element => element.attributes.type === 'standard.Rectangle'));

        if (clickedClass) {
            const classNode = $rdf.namedNode(clickedClass);
            const tableData1=rdfHelpers.getDirectProperties(store, classNode);
            const tableData2=rdfHelpers.getDataProperties(store, classNode);
            const tableData=Object.assign({}, tableData1, tableData2);
            setTableData(tableData);
            if (lastClickedClass === clickedClass) {
              showTooltip(evt as unknown as MouseEvent, tableData);
            }

        if (!createdRelatedDisks.includes(clickedDiskId)) {
            // Mark this disk as "expanded"
            createdRelatedDisks.push(clickedDiskId);

            const clickedNode = $rdf.namedNode(clickedClass);
            const outgoingConnectedClasses = rdfHelpers.getOutgoingConnectedClasses(store, clickedNode);
            const incomingConnectedClasses = rdfHelpers.getIncomingConnectedClasses(store, clickedNode);

            outgoingConnectedClasses.forEach(({ target, propertyUri }, index) => {
                createDiskAndLink(
                    graph,
                    target,
                    propertyUri,
                    'outgoing',
                    createdDiskById,
                    createdRelatedDisks,
                    cellView,
                    index,
                    store,
                    clickedDiskId
                );
                });

                incomingConnectedClasses.forEach(({ target, propertyUri }, index) => {
                createDiskAndLink(
                    graph,
                    target,
                    propertyUri,
                    'incoming',
                    createdDiskById,
                    createdRelatedDisks,
                    cellView,
                    index,
                    store,
                    clickedDiskId
                );
              });
        };
        lastClickedClass = clickedClass;
      }
    });
  }
  return () => {
    scroller.remove();
    paper.remove();
  };
}, [selectedClass, store, setTableData]);

  return (
    <div id="paper" ref={canvas}/>
  );
};

export default Diagram;
