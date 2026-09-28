"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestPasswordResetAction,
  signInAction,
  signUpAction,
  updatePasswordAction,
  type AuthState,
} from "@/lib/actions/auth";
import { Feedback, Field, fieldClass, primaryButtonClass } from "@/components/Feedback";

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUpAction, {} as AuthState);

  return (
    <form action={action} className="space-y-4">
      <Field label="Display name">
        <input
          name="displayName"
          required
          className={fieldClass}
          placeholder="Weiwei"
          autoComplete="name"
        />
      </Field>
      <Field label="Email">
        <input
          name="email"
          type="email"
          required
          className={fieldClass}
          placeholder="you@school.edu"
          autoComplete="email"
        />
      </Field>
      <Field label="Password">
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className={fieldClass}
          autoComplete="new-password"
        />
      </Field>
      <Feedback error={state.error} />
      <button className={primaryButtonClass} disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-sage-dark underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

export function SignInForm() {
  const [state, action, pending] = useActionState(signInAction, {} as AuthState);

  return (
    <form action={action} className="space-y-4">
      <Field label="Email">
        <input
          name="email"
          type="email"
          required
          className={fieldClass}
          autoComplete="email"
        />
      </Field>
      <Field label="Password">
        <input
          name="password"
          type="password"
          required
          className={fieldClass}
          autoComplete="current-password"
        />
      </Field>
      <Feedback error={state.error} />
      <button className={primaryButtonClass} disabled={pending}>
        {pending ? "Signing in…" : "Log in"}
      </button>
      <p className="text-sm text-muted">
        <Link href="/forgot-password" className="text-sage-dark underline">
          Forgot your password?
        </Link>
      </p>
      <p className="text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="text-sage-dark underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    requestPasswordResetAction,
    {} as AuthState,
  );

  return (
    <form action={action} className="space-y-4">
      <Field label="Email">
        <input
          name="email"
          type="email"
          required
          className={fieldClass}
          autoComplete="email"
        />
      </Field>
      <Feedback error={state.error} success={state.success} />
      <button className={primaryButtonClass} disabled={pending}>
        {pending ? "Sending link…" : "Send reset link"}
      </button>
      <p className="text-sm text-muted">
        Remembered it?{" "}
        <Link href="/login" className="text-sage-dark underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(
    updatePasswordAction,
    {} as AuthState,
  );

  return (
    <form action={action} className="space-y-4">
      <Field label="New password">
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className={fieldClass}
          autoComplete="new-password"
        />
      </Field>
      <Field label="Confirm new password">
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          className={fieldClass}
          autoComplete="new-password"
        />
      </Field>
      <Feedback error={state.error} />
      <button className={primaryButtonClass} disabled={pending}>
        {pending ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}
