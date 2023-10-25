import * as joint from 'jointjs';
import * as $rdf from 'rdflib';
import { getLabelFromURI, getOutgoingConnectedClasses, getIncomingConnectedClasses } from '@/components/rdfHelpers';

type Direction = 'incoming' | 'outgoing';
type CreatedDiskById = { [id: string]: string };
type CreatedRelatedDisks = string[];

export const createDiskAndLink = (
    graph: joint.dia.Graph,
    newNode: $rdf.NamedNode,
    property: $rdf.NamedNode,
    direction: Direction,
    createdDiskById: CreatedDiskById,
    createdRelatedDisks: CreatedRelatedDisks,
    cellView: joint.dia.CellView,
    index: number,
    store: $rdf.IndexedFormula,
    clickedDiskId: string
): void => {
    const newNodeClass = newNode ? newNode.value : null;

    if (newNodeClass && !Object.values(createdDiskById).includes(newNodeClass)) {

        const relatedDisk = new joint.shapes.standard.Circle({
        position: {
            x: cellView.model.attributes.position.x + 150,
            y: cellView.model.attributes.position.y + (index * 150)
        },
        size: { width: 100, height: 100 },
        attrs: {
        label: {
            text: getLabelFromURI(store, newNodeClass),
            fontSize: 14
        }
        }
    });
    graph.addCell(relatedDisk);

    createdRelatedDisks.push(newNodeClass);
    createdDiskById[relatedDisk.id] = newNodeClass;
    let linkAttributes = {
        line: {
          stroke: '#333333',
          strokeWidth: 2,
        },
    };

    if (direction === 'outgoing') {
        linkAttributes.line.targetMarker = {
          'type': 'path',
          'd': 'M 10 -5 0 0 10 5 z'
        };
    } else if (direction === 'incoming') {
        linkAttributes.line.sourceMarker = {
          'type': 'path',
          'd': 'M 10 -5 0 0 10 5 z'
      };
    }

    const link = new joint.shapes.standard.Link({
      source: { id: clickedDiskId },
      target: { id: relatedDisk.id },
      attrs: linkAttributes,
      labels: [
        {
          attrs: { text: { text: getLabelFromURI(store, property) } },
          position: {
            distance: 0.5,
            offset: 10
          }
        }
      ]
    });
    graph.addCell(link);
  }
};



