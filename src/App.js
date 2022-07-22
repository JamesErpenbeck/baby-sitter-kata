import React, { useState } from "react";
import "./App.css";

function App() {
  const [startTime, setStartTime] = useState("");
  const [bedTime, setBedTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [amountDue, setAmountDue] = useState(0);

  const startTimeHandler = (event) => {
    setStartTime(event.target.value);
  };
  const bedTimeHandler = (event) => {
    setBedTime(event.target.value);
  };
  const endTimeHandler = (event) => {
    setEndTime(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const start = parseFloat(startTime.split(":").join("."));
    const end = parseFloat(endTime.split(":").join("."));
    const bed = parseFloat(bedTime.split(":").join("."));

    if (start < 17) {
      setStartTime("");
      alert("Please enter a start time at or after 5PM");
    }

    //Bedtime rules could use more AC, so I went with just a valid time (5PM - 4AM)
    if (bed >= 5 && bed <= 16) {
      setBedTime("");
      alert("Bed time must be between 5PM and 4AM.");
    }

    //acceptable end time between 17 - 23 and 0 - 4. only invalid end times 5-16
    if (end >= 5 && end <= 16) {
      setEndTime("");
      alert("Please enter a end time at or before 4AM");
    }

    let startToBedPay = 0;
    let bedToMidnightPay = 0;
    let midnightToEndPay = 0;

    //If bedtime is between 12AM - 4AM
    if (bed >= 0 && bed <= 4) {
      startToBedPay = (23 - 17 + parseInt(bed)) * 12;
    } else {
      startToBedPay = parseInt(bed - start) * 12;
    }

    if (bed >= 0 && bed <= 4) {
      //If bedtime is after 12AM then $8hr window is skipped
    } else {
      bedToMidnightPay = parseInt(24 - bed) * 8;
    }

    if (end <= 4 && end >= 0) {
      midnightToEndPay = parseInt(end) * 16;
    }

    setAmountDue(startToBedPay + bedToMidnightPay + midnightToEndPay);
  };

  return (
    <div className="card">
      <form onSubmit={submitHandler}>
        <div className="form-content">
          <div className="form-field">
            <div className="label">Start Time</div>
            <input
              className="time-input"
              type="time"
              value={startTime}
              onChange={startTimeHandler}
              data-testid="start-time"
            ></input>
          </div>
          <div className="form-field">
            <div className="label">Bed Time</div>
            <input
              className="time-input"
              type="time"
              value={bedTime}
              onChange={bedTimeHandler}
              data-testid="bed-time"
            ></input>
          </div>
          <div className="form-field">
            <div className="label">End Time</div>
            <input
              className="time-input"
              type="time"
              value={endTime}
              onChange={endTimeHandler}
              data-testid="end-time"
            ></input>
          </div>
          <div className="button-container">
            <button className="button" data-testid="submit-btn">
              Submit
            </button>
          </div>
        </div>
      </form>
      <div className="amount-due form-field">
        <div className="label">Amount Due</div>
        <div className="amount-due-card" data-testid="amount-due">
          ${amountDue}
        </div>
      </div>
    </div>
  );
}

export default App;
