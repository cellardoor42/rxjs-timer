import React, { useState, useEffect } from 'react';
import { Subject } from 'rxjs';
import moment, { Moment } from 'moment';
import { INITIAL_TIME } from '../../App';

import './Timer.css';

interface ITimerProps {
  pauseSubject: Subject<boolean>;
  timer: Subject<Moment>;
  resetTime: () => void;
}

const Timer: React.FC<ITimerProps> = ({
  pauseSubject,
  timer,
  resetTime,
}: ITimerProps) => {
  const [currentTimerValue, setCurrentTimerValue] = useState<Moment>(
    INITIAL_TIME
  );
  const [isRunning, setIsRunning] = useState(false);
  const [atTheStart, setAtTheStart] = useState(true);

  useEffect(() => {
    timer.subscribe((value) => setCurrentTimerValue(value));
    pauseSubject.subscribe((running) => setIsRunning(running));
  }, []);

  useEffect(() => {
    setAtTheStart(moment(currentTimerValue).isSame(INITIAL_TIME()));
  }, [currentTimerValue]);

  const reset = () => {
    resetTime();
    timer.next(INITIAL_TIME());
  };

  return (
    <div className='timer-wrapper'>
      <span className='time'>
        {moment(currentTimerValue).format('HH : mm : ss')}
      </span>
      <div className='timer-actions'>
        {!isRunning && atTheStart && (
          <span className='action' onClick={() => pauseSubject.next(true)}>
            {' '}
            Start
          </span>
        )}
        {isRunning && (
          <span className='action' onClick={() => pauseSubject.next(false)}>
            {' '}
            Pause
          </span>
        )}
        {!isRunning && !atTheStart && (
          <>
            <span className='action' onClick={() => pauseSubject.next(true)}>
              {' '}
              Resume
            </span>
            <span className='action' onClick={reset}>
              {' '}
              Reset
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Timer;
