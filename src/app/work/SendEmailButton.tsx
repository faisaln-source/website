"use client";

import { Button } from "@once-ui-system/core";
import { openEmailClient } from "@/components";

interface SendEmailButtonProps {
  id: string;
  serviceTitle: string;
  className?: string;
}

export function SendEmailButton({ id, serviceTitle, className }: SendEmailButtonProps) {
  return (
    <Button
      id={id}
      onClick={() =>
        openEmailClient({
          to: "makewisedigitalsolution@gmail.com",
          subject: `Inquiry: ${serviceTitle}`,
          body: `Hi MakeWise,\n\nI am interested in ${serviceTitle}. Here are my requirements:\n\n`,
        })
      }
      variant="secondary"
      size="m"
      fillWidth
      data-button-outline="true"
      className={`btnOutline ${className || ""}`}
    >
      Send email
    </Button>
  );
}

export default SendEmailButton;
