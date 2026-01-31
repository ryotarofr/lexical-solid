import { createSignal, Show, onMount } from "solid-js";
import { Portal } from "solid-js/web";

export type URLInputModalProps = {
  title: string;
  placeholder: string;
  onSubmit: (url: string) => void;
  onClose: () => void;
  validate?: (url: string) => { isValid: boolean; errorMessage?: string };
};

export function URLInputModal(props: URLInputModalProps) {
  const [inputValue, setInputValue] = createSignal("");
  const [errorMessage, setErrorMessage] = createSignal<string | undefined>();
  let inputRef: HTMLInputElement | undefined;

  onMount(() => {
    // Focus the input when modal opens
    inputRef?.focus();
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const value = inputValue().trim();

    if (!value) {
      setErrorMessage("URL cannot be empty");
      return;
    }

    // Validate URL if validator is provided
    if (props.validate) {
      const validation = props.validate(value);
      if (!validation.isValid) {
        setErrorMessage(validation.errorMessage || "Invalid URL");
        return;
      }
    }

    props.onSubmit(value);
    props.onClose();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      props.onClose();
    }
  };

  const handleBackdropClick = (e: MouseEvent) => {
    // Close modal if clicking the backdrop (not the modal content)
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <Portal>
      <div class="modal-backdrop" onClick={handleBackdropClick}>
        <div class="modal-container" onKeyDown={handleKeyDown}>
          <div class="modal-header">
            <h3>{props.title}</h3>
            <button
              class="modal-close-button"
              onClick={props.onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit} class="modal-form">
            <div class="modal-body">
              <input
                ref={inputRef}
                type="text"
                class="modal-input"
                placeholder={props.placeholder}
                value={inputValue()}
                onInput={(e) => {
                  setInputValue(e.currentTarget.value);
                  setErrorMessage(undefined);
                }}
              />
              <Show when={errorMessage()}>
                <div class="modal-error">{errorMessage()}</div>
              </Show>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="modal-button modal-button-cancel"
                onClick={props.onClose}
              >
                Cancel
              </button>
              <button type="submit" class="modal-button modal-button-submit">
                Insert
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}
