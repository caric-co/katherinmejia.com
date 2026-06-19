import { useCallback, useEffect, useRef } from "react";

import { useAnimationControls } from "motion/react";

type AnimationControls = ReturnType<typeof useAnimationControls>;

const pulseRegistry = new Map<string, () => void>();

export function triggerPulse(id: string) {
  pulseRegistry.get(id)?.();
}

export function usePulse(id: string): AnimationControls {
  const controls = useAnimationControls();

  useEffect(() => {
    pulseRegistry.set(id, () => {
      controls.start({
        scale: [1, 1.03, 1],
        transition: { duration: 0.35, ease: "easeOut" },
      });
    });
    return () => {
      pulseRegistry.delete(id);
    };
  }, [id, controls]);

  return controls;
}

export function useSubmitPulse(id: string): AnimationControls {
  const controls = useAnimationControls();

  useEffect(() => {
    pulseRegistry.set(id, () => {
      controls.start({
        scale: [1, 1.04, 1],
        transition: { duration: 0.35, ease: "easeOut" },
      });
    });
    return () => {
      pulseRegistry.delete(id);
    };
  }, [id, controls]);

  return controls;
}

interface UseAutoAdvanceOptions {
  fieldId: string;
  nextFieldId?: string;
  submitId?: string;
  isFormValid?: boolean;
  hasErrors: boolean;
  debounceMs?: number;
}

export function useAutoAdvance({
  fieldId: _fieldId,
  nextFieldId,
  submitId,
  isFormValid,
  hasErrors,
  debounceMs = 700,
}: UseAutoAdvanceOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFormValidRef = useRef(isFormValid);
  isFormValidRef.current = isFormValid;

  const focusTarget = useCallback(() => {
    if (isFormValidRef.current && submitId) {
      triggerPulse(submitId);
      document.getElementById(submitId)?.focus();
      return;
    }
    if (nextFieldId) {
      triggerPulse(nextFieldId);
      document.getElementById(nextFieldId)?.focus();
    }
  }, [submitId, nextFieldId]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const startTimer = useCallback(() => {
    clearTimer();
    if (!inputRef.current?.value) return;
    if (!nextFieldId && !submitId) return;

    timerRef.current = setTimeout(() => {
      if (document.activeElement !== inputRef.current) return;
      if (hasErrors) return;
      focusTarget();
    }, debounceMs);
  }, [clearTimer, nextFieldId, submitId, hasErrors, debounceMs, focusTarget]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        clearTimer();
        focusTarget();
        return;
      }
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        clearTimer();
      }
    },
    [clearTimer, focusTarget],
  );

  const onBlur = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  return { inputRef, startTimer, onKeyDown, onBlur };
}
