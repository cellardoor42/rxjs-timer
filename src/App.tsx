import React, { useEffect } from 'react';
import { Subject, timer, NEVER } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import Timer from './components/Timer/Timer';
import moment, { Moment } from 'moment';

import './App.css';

export const INITIAL_TIME = () =>
  moment().hour(0).minute(0).second(0).millisecond(0);

const App: React.FC = () => {
  const timerSource = timer(0, 1000);
  const timerProvider = new Subject<Moment>();
  const pauseSubject = new Subject<boolean>();

  let secCounter = 0;

  useEffect(() => {
    pauseSubject
      .pipe(
        switchMap((running) =>
          !running
            ? NEVER
            : timerSource.pipe(
                map(() =>
                  moment()
                    .hour(0)
                    .minute(0)
                    .second(secCounter++)
                )
              )
        )
      )
      .subscribe((value) => timerProvider.next(value));
  }, []);

  const resetTime = () => {
    secCounter = 0;
  };

  return (
    <div className='App'>
      <div className='App-header'>
        <Timer
          pauseSubject={pauseSubject}
          timer={timerProvider}
          resetTime={resetTime}
        />
        <Timer
          pauseSubject={pauseSubject}
          timer={timerProvider}
          resetTime={resetTime}
        />
        <Timer
          pauseSubject={pauseSubject}
          timer={timerProvider}
          resetTime={resetTime}
        />
      </div>
    </div>
  );
};

export default App;
