import Icon, { SizeProp, ThickProp } from "../Icon/Icon";
import IconProp from "../../../Types/Icon/IconProp";
import React, { FunctionComponent, ReactElement } from "react";

export interface ComponentProps {
  onClose: () => void;
  children: ReactElement | Array<ReactElement>;
}

const FullPageModal: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  return (
    <div className="full-page-modal">
      <div
        className="margin-50 align-right"
        onClick={() => {
          props.onClose?.();
        }}
      >
        <Icon
          icon={IconProp.Close}
          size={SizeProp.ExtraLarge}
          thick={ThickProp.Thick}
        />
      </div>
      <div className="margin-50">{props.children}</div>
    </div>
  );
};

export default FullPageModal;
