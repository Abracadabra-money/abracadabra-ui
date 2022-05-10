export default function notification(fn = "pending", method = "approve") {
  if (fn === "pending") {
    pending(method);
  }

  if (fn === "success") {
    success();
  }

  if (fn === "error") {
    error();
  }
}

function success() {}

function pending(method) {
  let notification;
  method === "approve";

  return await this.$store.dispatch(
    "notifications/new",
    notification.approve.pending
  );
}

function error() {}
