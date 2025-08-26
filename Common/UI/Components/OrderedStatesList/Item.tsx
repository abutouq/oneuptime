import ActionButtonSchema from "../ActionButton/ActionButtonSchema";
import Button, { ButtonSize } from "../Button/Button";
import ConfirmModal from "../Modal/ConfirmModal";
import GenericObject from "../../../Types/GenericObject";
import React, { ReactElement, useState, useEffect } from "react";

export interface ComponentProps<T extends GenericObject> {
  item: T;
  actionButtons?: undefined | Array<ActionButtonSchema<T>>;
  titleField: keyof T;
  descriptionField?: keyof T | undefined;
  getTitleElement?: ((item: T) => ReactElement) | undefined;
  getDescriptionElement?: ((item: T) => ReactElement) | undefined;
}

type ItemFunction = <T extends GenericObject>(
  props: ComponentProps<T>,
) => ReactElement;

const Item: ItemFunction = <T extends GenericObject>(
  props: ComponentProps<T>,
): ReactElement => {
  const [isButtonLoading, setIsButtonLoading] = useState<Array<boolean>>(
    props.actionButtons?.map(() => {
      return false;
    }) || [],
  );

  const [error, setError] = useState<string>("");

  // Track mobile view for responsive behavior
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile: () => void = (): void => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div className="text-center border border-gray-300 rounded p-10 space-y-4 w-fit">
      {error && (
        <ConfirmModal
          title={`Error`}
          description={error}
          submitButtonText={"Close"}
          onSubmit={() => {
            return setError("");
          }}
        />
      )}

      {!props.getTitleElement && (
        <div>
          {props.item[props.titleField]
            ? (props.item[props.titleField] as string)
            : ""}
        </div>
      )}
      {props.getTitleElement && (
        <div className="justify-center flex">
          {props.getTitleElement(props.item)}
        </div>
      )}
      <div className="text-gray-500">
        {props.getDescriptionElement && (
          <div className="justify-center flex">
            {props.getDescriptionElement(props.item)}
          </div>
        )}
        {!props.getDescriptionElement && (
          <div>
            {props.descriptionField && props.item[props.descriptionField]
              ? (props.item[props.descriptionField] as string)
              : ""}
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {props.actionButtons?.map(
          (button: ActionButtonSchema<T>, i: number) => {
            if (button.isVisible && !button.isVisible(props.item)) {
              return <></>;
            }

            // Hide button on mobile if hideOnMobile is true
            if (button.hideOnMobile && isMobile) {
              return <></>;
            }

            return (
              <div key={i} className="">
                <Button
                  buttonSize={ButtonSize.Small}
                  title={button.title}
                  icon={button.icon}
                  buttonStyle={button.buttonStyleType}
                  isLoading={isButtonLoading[i]}
                  onClick={() => {
                    if (button.onClick) {
                      isButtonLoading[i] = true;
                      setIsButtonLoading(isButtonLoading);
                      button.onClick(
                        props.item,
                        () => {
                          // on action complete
                          isButtonLoading[i] = false;
                          setIsButtonLoading(isButtonLoading);
                        },
                        (err: Error) => {
                          isButtonLoading[i] = false;
                          setIsButtonLoading(isButtonLoading);
                          setError((err as Error).message);
                        },
                      );
                    }
                  }}
                />
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};

export default Item;
