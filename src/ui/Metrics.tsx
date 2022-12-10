import { Modal } from "@geist-ui/core";

type Props = {
  open: boolean;
};

export default function Metrics({ open }: Props) {
  return (
    <dialog>
      <Modal
        visible={open}
        keyboard={false}
        wrapClassName="metrics-css"
        disableBackdropClick
      >
        <Modal.Title>Latency</Modal.Title>
        <Modal.Content>
          <p>Modal content</p>
        </Modal.Content>
      </Modal>
    </dialog>
  );
}
