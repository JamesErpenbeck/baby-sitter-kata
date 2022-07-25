import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("calculates amount due with start to bed ($12hr) and bed to end ($8hr) rates", () => {
  render(<App />);

  const startTime = screen.getByTestId("start-time");
  expect(startTime).toBeInTheDocument();
  fireEvent.change(startTime, { target: { value: "17:00" } });
  expect(startTime).toHaveDisplayValue("17:00");

  const bedTime = screen.getByTestId("bed-time");
  expect(bedTime).toBeInTheDocument();
  fireEvent.change(bedTime, { target: { value: "20:00" } });
  expect(bedTime).toHaveDisplayValue("20:00");

  const endTime = screen.getByTestId("end-time");
  expect(endTime).toBeInTheDocument();
  fireEvent.change(endTime, { target: { value: "22:00" } });
  expect(endTime).toHaveDisplayValue("22:00");

  const submit = screen.getByTestId("submit-btn");
  expect(submit).toBeInTheDocument();
  fireEvent.click(submit);

  const amountDue = screen.getByTestId("amount-due");
  expect(amountDue).toBeInTheDocument();
  expect(amountDue).toHaveTextContent("$68");
});

test("calculates amount due start to bed, bed to midnight, and midnight to end rates", () => {
  render(<App />);

  const startTime = screen.getByTestId("start-time");
  expect(startTime).toBeInTheDocument();
  fireEvent.change(startTime, { target: { value: "17:00" } });
  expect(startTime).toHaveDisplayValue("17:00");

  const bedTime = screen.getByTestId("bed-time");
  expect(bedTime).toBeInTheDocument();
  fireEvent.change(bedTime, { target: { value: "20:00" } });
  expect(bedTime).toHaveDisplayValue("20:00");

  const endTime = screen.getByTestId("end-time");
  expect(endTime).toBeInTheDocument();
  fireEvent.change(endTime, { target: { value: "02:00" } });
  expect(endTime).toHaveDisplayValue("02:00");

  const submit = screen.getByTestId("submit-btn");
  expect(submit).toBeInTheDocument();
  fireEvent.click(submit);

  const amountDue = screen.getByTestId("amount-due");
  expect(amountDue).toBeInTheDocument();
  expect(amountDue).toHaveTextContent("$100");
});

test("calculates amount due with bedtime after midnight", () => {
  render(<App />);

  const startTime = screen.getByTestId("start-time");
  expect(startTime).toBeInTheDocument();
  fireEvent.change(startTime, { target: { value: "17:00" } });
  expect(startTime).toHaveDisplayValue("17:00");

  const bedTime = screen.getByTestId("bed-time");
  expect(bedTime).toBeInTheDocument();
  fireEvent.change(bedTime, { target: { value: "01:00" } });
  expect(bedTime).toHaveDisplayValue("01:00");

  const endTime = screen.getByTestId("end-time");
  expect(endTime).toBeInTheDocument();
  fireEvent.change(endTime, { target: { value: "03:00" } });
  expect(endTime).toHaveDisplayValue("03:00");

  const submit = screen.getByTestId("submit-btn");
  expect(submit).toBeInTheDocument();
  fireEvent.click(submit);

  const amountDue = screen.getByTestId("amount-due");
  expect(amountDue).toBeInTheDocument();
  expect(amountDue).toHaveTextContent("$132");
});

test("shows an alert if start time is before 5pm", () => {
  global.alert = jest.fn();
  jest.spyOn(global, "alert");
  render(<App />);

  const startTime = screen.getByTestId("start-time");
  expect(startTime).toBeInTheDocument();
  fireEvent.change(startTime, { target: { value: "16:00" } });

  const bedTime = screen.getByTestId("bed-time");
  expect(bedTime).toBeInTheDocument();
  fireEvent.change(bedTime, { target: { value: "18:00" } });

  const endTime = screen.getByTestId("end-time");
  fireEvent.change(endTime, { target: { value: "20:00" } });

  const submit = screen.getByTestId("submit-btn");
  expect(submit).toBeInTheDocument();
  fireEvent.click(submit);

  expect(global.alert).toHaveBeenCalledTimes(1);
  expect(global.alert).toHaveBeenCalledWith(
    "Please enter a start time at or after 5PM"
  );
});

test("shows an alert if bed time is not between 5PM and 4AM", () => {
  global.alert = jest.fn();
  jest.spyOn(global, "alert");
  render(<App />);

  const startTime = screen.getByTestId("start-time");
  fireEvent.change(startTime, { target: { value: "17:00" } });

  const bedTime = screen.getByTestId("bed-time");
  expect(bedTime).toBeInTheDocument();
  fireEvent.change(bedTime, { target: { value: "05:00" } });

  const endTime = screen.getByTestId("end-time");
  fireEvent.change(endTime, { target: { value: "18:00" } });

  const submit = screen.getByTestId("submit-btn");
  expect(submit).toBeInTheDocument();
  fireEvent.click(submit);

  expect(global.alert).toHaveBeenCalledTimes(1);
  expect(global.alert).toHaveBeenCalledWith(
    "Bed time must be between 5PM and 4AM."
  );
});

test("shows an alert if end time is not between 5PM and 4AM", () => {
  global.alert = jest.fn();
  jest.spyOn(global, "alert");
  render(<App />);

  const startTime = screen.getByTestId("start-time");
  fireEvent.change(startTime, { target: { value: "17:00" } });

  const bedtime = screen.getByTestId("bed-time");
  fireEvent.change(bedtime, { target: { value: "18:00" } });

  const endTime = screen.getByTestId("end-time");
  expect(endTime).toBeInTheDocument();
  fireEvent.change(endTime, { target: { value: "05:00" } });

  const submit = screen.getByTestId("submit-btn");
  expect(submit).toBeInTheDocument();
  fireEvent.click(submit);

  expect(global.alert).toHaveBeenCalledTimes(1);
  expect(global.alert).toHaveBeenCalledWith(
    "Please enter a end time at or before 4AM"
  );
});

test("disables submit if start time is empty", () => {
  render(<App />);

  const startTime = screen.getByTestId("start-time");
  fireEvent.change(startTime, { target: { value: "" } });

  const bedtime = screen.getByTestId("bed-time");
  fireEvent.change(bedtime, { target: { value: "18:00" } });

  const endTime = screen.getByTestId("end-time");
  fireEvent.change(endTime, { target: { value: "20:00" } });

  const submit = screen.getByTestId("submit-btn");
  expect(submit).toBeDisabled();
});

test("disables submit if bed time is empty", () => {
  render(<App />);

  const startTime = screen.getByTestId("start-time");
  fireEvent.change(startTime, { target: { value: "17:00" } });

  const bedtime = screen.getByTestId("bed-time");
  fireEvent.change(bedtime, { target: { value: "" } });

  const endTime = screen.getByTestId("end-time");
  fireEvent.change(endTime, { target: { value: "20:00" } });

  const submit = screen.getByTestId("submit-btn");
  expect(submit).toBeDisabled();
});

test("disables submit if end time is empty", () => {
  render(<App />);

  const startTime = screen.getByTestId("start-time");
  fireEvent.change(startTime, { target: { value: "17:00" } });

  const bedtime = screen.getByTestId("bed-time");
  fireEvent.change(bedtime, { target: { value: "18:00" } });

  const endTime = screen.getByTestId("end-time");
  fireEvent.change(endTime, { target: { value: "" } });

  const submit = screen.getByTestId("submit-btn");
  expect(submit).toBeDisabled();
});

test("submit button is enabled when all form fields are valid", () => {
  render(<App />);

  const startTime = screen.getByTestId("start-time");
  fireEvent.change(startTime, { target: { value: "17:00" } });

  const bedtime = screen.getByTestId("bed-time");
  fireEvent.change(bedtime, { target: { value: "18:00" } });

  const endTime = screen.getByTestId("end-time");
  fireEvent.change(endTime, { target: { value: "20:00" } });

  const submit = screen.getByTestId("submit-btn");
  expect(submit).not.toBeDisabled();
});
