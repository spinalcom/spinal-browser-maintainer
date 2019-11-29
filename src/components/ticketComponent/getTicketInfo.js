import dataService from "../../config/data";

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}

async function getLocal(ticket, res) {
  res.localModel = await dataService.ticketGetLocal(ticket);
  res.local = res.localModel.local.name;
  res.floor = res.localModel.floor.name;
}

async function getStep(ticket, res) {
  const ptr = await dataService.getTicketStep(ticket);
  res.stepName = ptr.info.name.get();
  res.stepColor = ptr.info.color.get();
  return getProcess(ptr, res);
}
async function getProcess(step, res) {
  const ptr = await dataService.getStepProcess(step);
  res.processName = ptr.info.name.get();
  res.processId = ptr.info.id.get();
}

export default function getTicket(ticketId) {
  const ticket = spinal.spinalGraphService.getRealNode(ticketId);
  const res = {
    ticketId
  };
  res.ticketName = ticket.info.name.get();
  res.creationDate = timeConverter(ticket.info.creationDate.get());
  try {
    res.appelant = ticket.info.appelant.get();
  } catch (e) {
    res.appelant = "-";
  }
  try {
    res.material = ticket.info.equipement.get();
  } catch (e) {
    res.material = "-";
  }
  return Promise.all([getLocal(ticket, res), getStep(ticket, res)])
    .then(() => res);

}

export { getTicket };
