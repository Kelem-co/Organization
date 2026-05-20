# Media Form Rules

Use these rules for any form that uploads or removes media before submitting a mutation.

## Required behavior

- Treat media upload and media removal as blocking form operations.
- Surface uploader busy state to the parent form with a callback such as `onBusyChange`.
- Disable the submit button while media is uploading or being removed.
- Add a submit-time guard in the handler so the mutation cannot run before the media ID is ready.

## Expected wiring

- `MediaUploader` owns the upload/remove lifecycle.
- The parent form owns whether submit is allowed.
- The mutation payload must only include the final media ID after upload completes.

## Minimum checklist

- Submit button shows a busy state during upload/remove.
- Submit button is disabled during upload/remove.
- Handler returns early with a user-facing error if submit is attempted while media is busy.
- Edit flows handle both replacement and removal of existing media.
