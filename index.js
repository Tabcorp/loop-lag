module.exports = function (cb, poll_delay_period, reset_poll_delay_period) {

  // set an interval which should take 500ms by default
  var poll_delay_period = poll_delay_period || 500; // 500ms

  // reset approx every 5 mins by default
  var reset_poll_delay_period = reset_poll_delay_period || (1000 * 60 * 5);

  var evloop_delay = 0;
  var reset_flag = false;

  var hrtime = process.hrtime();
  var start_time = msTime();

  setTimeout(eventLoopPing, poll_delay_period).unref();
  setTimeout(resetPing, reset_poll_delay_period).unref();

  function eventLoopPing() {
    difftime = process.hrtime(hrtime)
    var check_time = msTime();
    var diff_time = check_time - start_time - poll_delay_period;
    start_time = msTime();

    if (reset_flag) {
      if (cb) {
        cb(evloop_delay)
      } else {
        console.log("event loop delay was:", evloop_delay.toFixed(2), "ms");
      }
    }

    if (reset_flag || evloop_delay < diff_time) {
      evloop_delay = diff_time;
      reset_flag = false;
    }

    setTimeout(eventLoopPing, poll_delay_period).unref();
  };

  function resetPing() {
    reset_flag = true;
    // add a random element to avoid regular pollers from
    // being overly skewed (e.g. if they always poll after a reset)
    setTimeout(resetPing, reset_poll_delay_period*(Math.random()+0.5)).unref();
  };

  function msTime() {
    var time = process.hrtime();
    return (time[0] * 1000) + (time[1] / 1000000);
  }

};
