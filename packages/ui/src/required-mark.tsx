export function RequiredMark() {
  return (
    <>
      <span className="required-mark" aria-hidden="true">
        *
      </span>
      <span className="sr-only"> (required)</span>
    </>
  );
}
export function RequiredNotice() {
  return (
    <p className="required-notice">
      Fields marked{" "}
      <span className="required-mark" aria-hidden="true">
        *
      </span>
      <span className="sr-only">with an asterisk</span> are required. All others
      are optional.
    </p>
  );
}
