import { useState, useEffect } from 'react';

import moment from 'moment';

type d = null | number;

function Calendar() {
  const [calendarGrid, setCalendarGrid] = useState<Array<Array<d>>>([]);

  const [currentMonth, setCurrentMonth] = useState<d>(null);

  const [startDate, setStartDate] = useState<d>(null);

  const [endDate, setEndDate] = useState<d>(null);

  function dayDisabled(rowIdx: number, day: d) {
    if (!day) {
      return false;
    }

    if (rowIdx <= 1 && day > 14) {
      return true;
    }

    if (rowIdx > 3 && day < 14) {
      return true;
    }

    return false;
  }

  function dayClassName(day: d, disabled: boolean) {
    if (!day) {
      return 'day';
    }

    if (disabled) {
      return 'day disabled';
    }

    if (startDate && endDate && day >= startDate && day <= endDate) {
      return 'day active';
    }

    if (day === startDate || day === endDate) {
      return 'day active';
    }

    if (day === moment().date() && currentMonth === moment().month() + 1) {
      return 'day today';
    }

    return 'day';
  }

  function handleClickDay(day: d) {
    if (!day) {
      return;
    }

    if (!startDate) {
      setStartDate(day);
    }

    if (startDate && (day > startDate || day === startDate)) {
      setEndDate(day);
    }

    if (startDate && day < startDate) {
      setStartDate(day);
    }
  }

  function switchMonth(type: 'prev' | 'next') {
    setStartDate(null);
    setEndDate(null);

    if (!currentMonth) {
      return;
    }

    if (type === 'prev') {
      setCurrentMonth(currentMonth - 1);
    }

    if (type === 'next') {
      setCurrentMonth(currentMonth + 1);
    }
  }

  useEffect(() => {
    setCurrentMonth(moment().month() + 1);
  }, []);

  useEffect(() => {
    if (!currentMonth) {
      return;
    }

    const year = 2024;
    const month = currentMonth < 10 ? `0${currentMonth}` : currentMonth;
    const Moment = moment(`${year}-${month}`);
    const daysInMonth = Moment.daysInMonth();
    const firstDayOfWeek = Moment.startOf('month').day();

    const cg = [];

    for (let i = 0; i < 6; i++) {
      const week = [];

      for (let j = 0; j < 7; j++) {
        const day = i * 7 + j + 1 - firstDayOfWeek;

        if (day > 0 && day <= daysInMonth) {
          week.push(day);
        } else {
          week.push(null);
        }
      }

      cg.push(week);
    }

    if (cg[0].includes(null)) {
      const year = currentMonth === 1 ? 2023 : 2024;
      const prevMonth = currentMonth - 1 === 0 ? 12 : currentMonth - 1;
      const prevMonthFormat = prevMonth < 10 ? `0${prevMonth}` : prevMonth;
      let daysInPrevMonth = moment(`${year}-${prevMonthFormat}`).daysInMonth();

      cg[0].reverse();

      for (let i = 0; i < cg[0].length; i++) {
        if (cg[0][i] === null) {
          cg[0][i] = daysInPrevMonth;
          daysInPrevMonth--;
        }
      }

      cg[0].reverse();
    }

    if (cg[4].includes(null) || cg[5].includes(null)) {
      let n = 1;

      for (let i = 0; i < cg[4].length; i++) {
        if (cg[4][i] === null) {
          cg[4][i] = n;
          n++;
        }
      }

      for (let i = 0; i < cg[5].length; i++) {
        if (cg[5][i] === null) {
          cg[5][i] = n;
          n++;
        }
      }
    }

    setCalendarGrid(cg);
  }, [currentMonth]);

  return (
    <div className="layout">
      <div className="header">
        <button
          type="button"
          className="header-button"
          disabled={currentMonth === 1}
          onClick={() => switchMonth('prev')}
        >
          &lt;
        </button>
        <p>{currentMonth}月</p>
        <button
          type="button"
          className="header-button"
          disabled={currentMonth === 12}
          onClick={() => switchMonth('next')}
        >
          &gt;
        </button>
      </div>

      {calendarGrid.map((row, rowIdx) =>
        row.map((day) => (
          <button
            type="button"
            key={Math.random()}
            className={dayClassName(day, dayDisabled(rowIdx, day))}
            disabled={dayDisabled(rowIdx, day)}
            onClick={() => handleClickDay(day)}
          >
            {day}日
          </button>
        ))
      )}
    </div>
  );
}

export default Calendar;
