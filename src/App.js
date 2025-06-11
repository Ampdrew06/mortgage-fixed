
import React, { useState } from 'react';

export default function App() {
  const [loan, setLoan] = useState('');
  const [term, setTerm] = useState('');
  const [fixedRate, setFixedRate] = useState('');
  const [fixedYears, setFixedYears] = useState('');
  const [followRate, setFollowRate] = useState('');
  const [overpay, setOverpay] = useState('');
  const [targetYears, setTargetYears] = useState('');

  const toNum = val => parseFloat(val) || 0;

  const calcPMT = (rate, nper, pv) => {
    if (rate === 0) return -(pv / nper);
    return -(pv * rate * Math.pow(1 + rate, nper)) / (Math.pow(1 + rate, nper) - 1);
  };

  const initialMonthly = () => {
    const r = toNum(fixedRate) / 100 / 12;
    const n = toNum(targetYears) > 0 ? toNum(targetYears) * 12 : toNum(fixedYears) * 12;
    return calcPMT(r, n, toNum(loan)) + toNum(overpay);
  };

  const outstanding = () => {
    const r = toNum(fixedRate) / 100 / 12;
    const n = toNum(fixedYears) * 12;
    const pmt = initialMonthly();
    return toNum(loan) * Math.pow(1 + r, n) - pmt * (Math.pow(1 + r, n) - 1) / r;
  };

  const postFixedMonthly = () => {
    const r = toNum(followRate) / 100 / 12;
    const n = (toNum(term) - toNum(fixedYears)) * 12;
    const balance = outstanding();
    return calcPMT(r, n, balance);
  };

  const yearsRemaining = () => {
    const r = toNum(fixedRate) / 100 / 12;
    const pmt = initialMonthly();
    const n = Math.log(pmt / (pmt - r * toNum(loan))) / Math.log(1 + r);
    return toNum(targetYears) > 0 ? targetYears : (n / 12).toFixed(2);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Mortgage Calculator</h2>
      <input placeholder="Loan Amount (£)" onChange={e => setLoan(e.target.value)} /><br/>
      <input placeholder="Loan Term (Years)" onChange={e => setTerm(e.target.value)} /><br/>
      <input placeholder="Fixed Term Rate (%)" onChange={e => setFixedRate(e.target.value)} /><br/>
      <input placeholder="Fixed Term (Years)" onChange={e => setFixedYears(e.target.value)} /><br/>
      <input placeholder="Secondary Rate (%)" onChange={e => setFollowRate(e.target.value)} /><br/>
      <input placeholder="Optional Overpayment (£)" onChange={e => setOverpay(e.target.value)} /><br/>
      <input placeholder="Target Years (Optional)" onChange={e => setTargetYears(e.target.value)} /><br/><br/>

      <div><strong>Initial Fixed Monthly Payment (£):</strong> {initialMonthly().toFixed(2)}</div>
      <div><strong>Secondary Rate Payment (£):</strong> {postFixedMonthly().toFixed(2)}</div>
      <div><strong>Years Remaining:</strong> {yearsRemaining()}</div>
      <div><strong>Remaining at Initial Fixed Rate Point (£):</strong> {outstanding().toFixed(2)}</div>
    </div>
  );
}
