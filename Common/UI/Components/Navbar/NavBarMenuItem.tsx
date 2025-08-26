import Icon from "../Icon/Icon";
import Link from "../Link/Link";
import Route from "../../../Types/API/Route";
import IconProp from "../../../Types/Icon/IconProp";
import React, { FunctionComponent, ReactElement } from "react";

export interface ComponentProps {
  title: string;
  route: Route;
  icon: IconProp;
  description: string;
  onClick: () => void;
}

const NavBarMenuItem: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  return (
    <div className="dropdown">
      <Link
        onClick={props.onClick}
        to={props.route}
        className="-m-3 text-left flex items-start rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-50"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-indigo-500 text-white sm:h-12 sm:w-12">
          <Icon icon={props.icon} className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-base font-medium text-gray-900">{props.title}</p>
          <p className="text-sm text-gray-500">{props.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default NavBarMenuItem;
