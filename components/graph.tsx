//import * as joint from 'jointjs';
import * as d3 from 'd3';
import * as $rdf from 'rdflib';
import { getLabelFromURI, getOutgoingConnectedClasses, getIncomingConnectedClasses } from '@/components/rdfHelpers';

type Direction = 'incoming' | 'outgoing';
type CreatedDiskById = { [id: string]: string };
type CreatedRelatedDisks = string[];

export const createDiskAndLink = (
    svg: d3.Selection<SVGSVGElement,unknown,null,undefined>,
    newNode: string,
    property: string,
    direction: Direction,
    createdDiskById: CreatedDiskById,
    createdRelatedDisks: CreatedRelatedDisks,
    clickedDiskId: string
): void => {
    const newNodeClass = Object.values(createdDiskById).includes(newNode);

    if (!newNodeClass) {

        const relatedDisk = svg.append('circle')
        .attr('cx',150)
        .attr('cy',(createdRelatedDisks.length * 150)+ 150 )
        .attr('r',50)
        .style('fill','#FFFFFF')

    createdRelatedDisks.push(newNode);
    createdDiskById[relatedDisk.attr('id')] = newNode;

    const linkAttributes = d3.linkHorizontal()
      .x(d => d.x)
      .y(d => d.y);

    const link = svg.append('line')
    .attr('class','link')
    .attr('d',() => {
      const sourceMarker = { x: +svg.select('circle[id=${clickedDiskId}]').attr('cx'), y: +svg.select('circle[id=${clickedDiskId}]`).attr('cy')')};
      const targetMarker = { x: +relatedDisk.attr('cx'), y: +relatedDisk.attr('cy')};
      return linkAttributes({ source: sourceMarker, target: targetMarker});
    })
      .style('stroke', '#333333')
      .style('stroke-width', 2)
      .attr('marker-end', direciton === 'outgoing' ? 'url(#arrowhead-outgoing)' : 'url(#arrowhead-incoming)');


    svg.append('text')
      .attr('x', +relatedDisk.attr('cx')+75)
      .attr('y', +relatedDisk.attr('cy'))
      .text(property)
      .style('font-size', '14px');

      svg.append('text')
      .attr('x', +relatedDisk.attr('cx'))
      .attr('y', +relatedDisk.attr('cy'))
      .text(newNode)
      .style('font-size', '14px');
  }
};

/*
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
*/