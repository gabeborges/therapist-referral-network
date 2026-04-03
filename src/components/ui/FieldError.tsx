interface FieldErrorProps {
  id?: string;
  message?: string;
}

export function FieldError({ id, message }: FieldErrorProps): React.ReactElement | null {
  if (!message) return null;

  return (
    <p id={id} className="mt-1 text-[0.75rem] text-err">
      {message}
    </p>
  );
}
