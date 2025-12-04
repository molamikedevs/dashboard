import { Button } from "./button";

interface DeleteModalProps {
  getDeleteMessage: () => string;
  resolve: (value: boolean) => void;
  reject: (reason?: unknown) => void;
  closeToast?: () => void;
}

export default function DeleteModal({
  getDeleteMessage,
  resolve,
  reject,
  closeToast,
}: DeleteModalProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-medium">{getDeleteMessage()}</p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => {
            if (closeToast) closeToast();
            resolve(true);
          }}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-500 transition-colors">
          Yes, delete
        </button>
        <Button
          onClick={() => {
            if (closeToast) closeToast();
            reject(new Error("Cancelled"));
          }}
          className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors">
          Cancel
        </Button>
      </div>
    </div>
  );
}
