"use client";
import { ChangeEvent, useId, useMemo } from "react";

type QuestionOption = {
  label: string;
  value: string;
  description?: string;
};

type QuestionType =
  | "text"
  | "textarea"
  | "select"
  | "date"
  | "email"
  | "number"
  | "tel";

type QuestionProps = {
  id: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  type?: QuestionType;
  options?: QuestionOption[];
  assistiveText?: string;
  className?: string;
  disabled?: boolean;
};

function classNames(
  ...classes: Array<string | null | false | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function Question({
  id,
  label,
  description,
  placeholder,
  required,
  value = "",
  onChange,
  type = "text",
  options = [],
  assistiveText,
  className,
  disabled,
}: QuestionProps) {
  const generatedId = useId();
  const controlId = `${id}-${generatedId}`;

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    onChange?.(event.target.value);
  };

  const selectedOption = useMemo(() => {
    if (type !== "select" || !options.length) {
      return undefined;
    }

    return options.find((option) => option.value === value);
  }, [options, type, value]);

  const descriptionId = description ? `${controlId}-description` : undefined;
  const assistiveId = assistiveText ? `${controlId}-assistive` : undefined;
  const optionId =
    selectedOption?.description && type === "select"
      ? `${controlId}-selected`
      : undefined;

  const describedBy = [descriptionId, assistiveId, optionId]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classNames(
        "flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-5 shadow-sm transition",
        disabled ? "opacity-60" : undefined,
        className
      )}
    >
      <div className="space-y-1">
        <label
          htmlFor={controlId}
          className="text-sm font-semibold text-foreground"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div>
        {type === "select" ? (
          <select
            id={controlId}
            name={id}
            value={value}
            onChange={handleChange}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-describedby={describedBy || undefined}
            required={required}
            disabled={disabled}
          >
            <option value="">
              {placeholder ?? "Select an option"}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            id={controlId}
            name={id}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-describedby={describedBy || undefined}
            required={required}
            disabled={disabled}
          />
        ) : (
          <input
            id={controlId}
            name={id}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-describedby={describedBy || undefined}
            required={required}
            disabled={disabled}
          />
        )}
      </div>
      <div className="space-y-2">
        {assistiveText && (
          <p id={assistiveId} className="text-xs text-muted-foreground">
            {assistiveText}
          </p>
        )}
        {selectedOption?.description && (
          <p id={optionId} className="text-xs text-muted-foreground">
            {selectedOption.description}
          </p>
        )}
      </div>
    </div>
  );
}
