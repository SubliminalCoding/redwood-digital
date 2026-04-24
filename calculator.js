/* Missed-call revenue calculator.
   Attaches to every .leak-calc on the page, so multiple calculators
   can coexist (though in practice there's one per page). */
(function () {
  'use strict';

  var currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  function num(el) {
    var v = el ? parseFloat(el.value) : 0;
    return isFinite(v) && v > 0 ? v : 0;
  }
  function pct(el) {
    return Math.min(Math.max(num(el), 0), 100) / 100;
  }

  function paintRange(el) {
    if (!el || el.type !== 'range') return;
    var min = parseFloat(el.min) || 0;
    var max = parseFloat(el.max) || 100;
    var val = parseFloat(el.value);
    var ratio = max > min ? ((val - min) / (max - min)) * 100 : 0;
    el.style.setProperty('--leak-range-pct', ratio + '%');
  }

  function bind(root) {
    var q = function (sel) { return root.querySelector(sel); };

    var inputs = {
      calls:      q('[data-leak="monthlyCalls"]'),
      missed:     q('[data-leak="missedCallPercent"]'),
      afterHours: q('[data-leak="afterHoursPercent"]'),
      booking:    q('[data-leak="bookingRate"]'),
      job:        q('[data-leak="avgJobValue"]'),
      margin:     q('[data-leak="grossMargin"]'),
    };
    var outs = {
      missedDisp:       q('[data-leak-out="missedCallDisplay"]'),
      afterHoursDisp:   q('[data-leak-out="afterHoursDisplay"]'),
      bookingDisp:      q('[data-leak-out="bookingRateDisplay"]'),
      marginDisp:       q('[data-leak-out="grossMarginDisplay"]'),
      monthlyLost:      q('[data-leak-out="monthlyLostRevenue"]'),
      yearlyLost:       q('[data-leak-out="yearlyLostRevenue"]'),
      jobsLost:         q('[data-leak-out="jobsLost"]'),
      profitAtRisk:     q('[data-leak-out="grossProfitAtRisk"]'),
      breakEven:        q('[data-leak-out="breakEvenPrice"]'),
      currentMissed:    q('[data-leak-out="currentMissedCalls"]'),
      currentLost:      q('[data-leak-out="currentLostRevenue"]'),
      recovered:        q('[data-leak-out="recoveredRevenue"]'),
    };

    function set(el, text) { if (el) el.textContent = text; }

    function repaintRanges() {
      paintRange(inputs.missed);
      paintRange(inputs.afterHours);
      paintRange(inputs.booking);
      paintRange(inputs.margin);
    }

    function calc() {
      var calls      = num(inputs.calls);
      var missed     = pct(inputs.missed);
      var afterHours = pct(inputs.afterHours);
      var booking    = pct(inputs.booking);
      var job        = num(inputs.job);
      var margin     = pct(inputs.margin);

      set(outs.missedDisp,     Math.round(missed * 100)     + '%');
      set(outs.afterHoursDisp, Math.round(afterHours * 100) + '%');
      set(outs.bookingDisp,    Math.round(booking * 100)    + '%');
      set(outs.marginDisp,     Math.round(margin * 100)     + '%');

      var missedCalls   = calls * missed;
      var afterHoursMC  = missedCalls * afterHours;
      var lostJobs      = afterHoursMC * booking;
      var monthlyRev    = lostJobs * job;
      var yearlyRev     = monthlyRev * 12;
      var profit        = monthlyRev * margin;

      set(outs.monthlyLost,   currency.format(monthlyRev));
      set(outs.yearlyLost,    currency.format(yearlyRev));
      set(outs.jobsLost,      lostJobs.toLocaleString('en-US', { maximumFractionDigits: 1 }));
      set(outs.profitAtRisk,  currency.format(profit));
      set(outs.breakEven,     currency.format(profit));
      set(outs.currentMissed, afterHoursMC.toLocaleString('en-US', { maximumFractionDigits: 1 }));
      set(outs.currentLost,   currency.format(monthlyRev));
      set(outs.recovered,     currency.format(monthlyRev));
    }

    var engaged = false;
    function markEngaged() {
      if (engaged) return;
      engaged = true;
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'leak_calc_interact', { event_category: 'engagement' });
      }
    }

    Object.keys(inputs).forEach(function (k) {
      if (inputs[k]) {
        inputs[k].addEventListener('input', calc);
        inputs[k].addEventListener('input', repaintRanges);
        inputs[k].addEventListener('input', markEngaged, { once: true });
      }
    });
    repaintRanges();
    calc();
  }

  function init() {
    var roots = document.querySelectorAll('.leak-calc');
    for (var i = 0; i < roots.length; i++) bind(roots[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
