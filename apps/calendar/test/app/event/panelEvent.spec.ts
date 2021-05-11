import { getGridStyleInfo, getViewModels, getWidth, isInGrid } from '@src/event/panelEvent';
import Schedule from '@src/model/schedule';
import ScheduleViewModel from '@src/model/scheduleViewModel';
import { createDate } from '@test/helper';

import type { Cells } from '@t/panel';

describe('panelEvent', () => {
  const totalWidth = 100;
  let narrowWeekend: boolean;
  let cells: Cells;

  describe('narrowWeekend is true', () => {
    beforeAll(() => {
      narrowWeekend = true;
    });

    it('should return single PanelEventInfo', () => {
      cells = [createDate(2021, 4, 16)];

      const { widthList, leftList } = getGridStyleInfo(cells, narrowWeekend, totalWidth);

      expect(widthList).toHaveLength(1);
      expect(widthList).toEqual([100]);
      expect(leftList).toHaveLength(1);
      expect(leftList).toEqual([0]);
    });

    it('should return PanelEventInfo list (only weekday)', () => {
      // Mon, Tue, Wed, Thu, Fri
      cells = [12, 13, 14, 15, 16].map((d) => createDate(2021, 4, d));

      const { widthList, leftList } = getGridStyleInfo(cells, narrowWeekend, totalWidth);

      expect(widthList).toHaveLength(5);
      expect(widthList).toEqual([20, 20, 20, 20, 20]);
      expect(leftList).toHaveLength(5);
      expect(leftList).toEqual([0, 20, 40, 60, 80]);
    });

    it('should return PanelEventInfo list (only weekend)', () => {
      // Sat, Sun
      cells = [17, 18].map((d) => createDate(2021, 4, d));

      const { widthList, leftList } = getGridStyleInfo(cells, narrowWeekend, totalWidth);

      expect(widthList).toHaveLength(2);
      expect(widthList).toEqual([50, 50]);
      expect(leftList).toHaveLength(2);
      expect(leftList).toEqual([0, 50]);
    });

    it('should return PanelEventInfo list', () => {
      // Thu, Fri, Sat
      cells = [15, 16, 17].map((d) => createDate(2021, 4, d));

      const { widthList, leftList } = getGridStyleInfo(cells, narrowWeekend, totalWidth);

      expect(widthList).toHaveLength(3);
      expect(widthList).toEqual([40, 40, 20]);
      expect(leftList).toHaveLength(3);
      expect(leftList).toEqual([0, 40, 80]);
    });
  });

  describe('narrowWeekend is false', () => {
    beforeAll(() => {
      narrowWeekend = false;
    });

    it('should return single PanelEventInfo', () => {
      cells = [createDate(2021, 4, 16)];

      const { widthList, leftList } = getGridStyleInfo(cells, narrowWeekend, totalWidth);

      expect(widthList).toHaveLength(1);
      expect(widthList).toEqual([100]);
      expect(leftList).toHaveLength(1);
      expect(leftList).toEqual([0]);
    });

    it('should return PanelEventInfo list (only weekday)', () => {
      // Mon, Tue, Wed, Thu, Fri
      cells = [12, 13, 14, 15, 16].map((d) => createDate(2021, 4, d));

      const { widthList, leftList } = getGridStyleInfo(cells, narrowWeekend, totalWidth);

      expect(widthList).toHaveLength(5);
      expect(widthList).toEqual([20, 20, 20, 20, 20]);
      expect(leftList).toHaveLength(5);
      expect(leftList).toEqual([0, 20, 40, 60, 80]);
    });

    it('should return PanelEventInfo list (only weekend)', () => {
      // Sat, Sun
      cells = [17, 18].map((d) => createDate(2021, 4, d));

      const { widthList, leftList } = getGridStyleInfo(cells, narrowWeekend, totalWidth);

      expect(widthList).toHaveLength(2);
      expect(widthList).toEqual([50, 50]);
      expect(leftList).toHaveLength(2);
      expect(leftList).toEqual([0, 50]);
    });

    it('should return PanelEventInfo list', () => {
      // Thu, Fri, Sat, Sun
      cells = [15, 16, 17, 18].map((d) => createDate(2021, 4, d));

      const { widthList, leftList } = getGridStyleInfo(cells, narrowWeekend, totalWidth);

      expect(widthList).toHaveLength(4);
      expect(widthList).toEqual([25, 25, 25, 25]);
      expect(leftList).toHaveLength(4);
      expect(leftList).toEqual([0, 25, 50, 75]);
    });
  });

  it('should return sum of width', () => {
    const widthList = [1, 2, 3, 4, 5];
    const { length } = widthList;

    for (let start = 0; start < length; start += 1) {
      for (let end = start; end < length; end += 1) {
        const result = getWidth(widthList, start, end);
        let sum = 0;

        for (let i = start; i <= end; i += 1) {
          sum += widthList[i];
        }

        expect(result).toBe(sum);
      }
    }
  });

  const data = [
    { start: createDate(2021, 4, 30), end: createDate(2021, 5, 2) }, // Fri ~ Sun
    { start: createDate(2021, 5, 2), end: createDate(2021, 5, 4) }, // Sun ~ Tue
    { start: createDate(2021, 5, 4), end: createDate(2021, 5, 6) }, // Tue ~ Thu
  ];

  it('should return whether it is in grid or not', () => {
    const cell = createDate(2021, 5, 3);

    const viewModels = data.map((e) => {
      const event = Schedule.create(e);
      event.isAllDay = true;

      return ScheduleViewModel.create(event);
    });

    const result = viewModels.filter(isInGrid(cell));
    const viewModelsInGrid = [viewModels[1]];

    expect(result).toEqual(viewModelsInGrid);
  });

  it('should return sorted viewModels', () => {
    // Sun ~ Sat
    cells = [2, 3, 4, 5, 6, 7, 8].map((d) => createDate(2021, 5, d));
    const events = data.map((e) => Schedule.create(e));

    const result = getViewModels(events, cells);
    const viewModels = events.map((event) => ScheduleViewModel.create(event));

    expect(result).toEqual(viewModels);
  });
});