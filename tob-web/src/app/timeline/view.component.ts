import { Component, Input, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Model } from '../data-types';
import { Timeline } from '../timeline/timeline';

@Component({
  selector: 'timeline-view',
  template: `<div #outer></div>`,
  styleUrls: [
    '../../themes/_active/timeline/timeline.scss',
  ],
  host: {
    '(window:resize)': 'onResize($event)',
  }
})
export class TimelineViewComponent implements AfterViewInit {
  @ViewChild('outer') private _outer: ElementRef;
  private _timeline: Timeline.TimelineView;
  private _range: {start: (string | Date), end: (string | Date)};
  private _rows: Timeline.RowSpec[] = [];

  constructor(
    private _renderer: Renderer2,
    private _router: Router,
  ) { }

  ngAfterViewInit() {
    this._timeline = new Timeline.TimelineView(this._outer.nativeElement, null, this._renderer);
    this._timeline.setRange(this.rangeStart, this.rangeEnd);
    this._timeline.setRows(this.rows);
    this._timeline.render();
    this._renderer.listen(this._timeline.container, 'slotclick', this.click.bind(this));
  }

  click(evt) {
    console.log(evt.detail.spec.url);
    this._router.navigate([evt.detail.spec.url]);
  }

  get rangeStart() {
    if(! this._range || ! this._range.start) {
      let d = new Date();
      d.setFullYear(d.getFullYear() - 1);
      return d.toISOString();
    }
    return this._range.start;
  }

  get rangeEnd() {
    if(! this._range || ! this._range.end) {
      let d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      return d.toISOString();
    }
    return this._range.end;
  }

  get range() {
    return {start: this.rangeStart, end: this.rangeEnd};
  }

  @Input() set range(rng: {start: (string | Date), end: (string | Date)}) {
    this._range = rng;
    if(this._timeline)
      this._timeline.setRange(this.rangeStart, this.rangeEnd);
  }

  get rows() {
    return this._rows;
  }

  @Input() set rows(vals: Timeline.RowSpec[]) {
    this._rows = vals;
    if(this._timeline)
      this._timeline.setRows(this.rows);
  }

  onResize() {
    if(this._timeline)
      this._timeline.update();
  }

  get testdata(): Timeline.RowSpec[] {
    let rows = [];
    rows.push(
      {
        id: 'set-1',
        slots: [
          {
            id: 'slot-1a',
            groups: ['all'],
            htmlContent: '<strong>Testing</strong>,<br>testing',
            start: '2018-06-01T00:00:00Z',
            end: '2020-05-31T00:00:00Z',
            classNames: ['slot-primary'],
          },
          {
            id: 'slot-1b',
            groups: ['all'],
            htmlContent: '<strong>Testing</strong>,<br>testing',
            start: '2020-05-31T00:00:00Z',
            end: '2021-05-31T00:00:00Z',
            classNames: ['slot-secondary'],
          }
        ]
      }
    );
    rows.push(
      {
        id: 'set-2',
        slots: [
          {
            id: 'slot-2',
            groups: ['all'],
            htmlContent: 'Hello there',
            start: '2020-03-15T00:00:00Z',
            end: '2030-05-31T00:00:00Z',
            classNames: ['slot-primary'],
          }
        ]
      }
    );
    return rows;
  }

}
