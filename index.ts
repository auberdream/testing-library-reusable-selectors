import {
  ByRoleMatcher,
  ByRoleOptions,
  findAllByDisplayValue,
  findAllByLabelText,
  findAllByRole,
  findByDisplayValue,
  findByLabelText,
  findByRole,
  getAllByDisplayValue,
  getAllByLabelText,
  getAllByRole,
  getByDisplayValue,
  getByLabelText,
  getByRole,
  Matcher,
  MatcherOptions,
  queryAllByDisplayValue,
  queryAllByLabelText,
  queryAllByRole,
  queryByDisplayValue,
  queryByLabelText,
  queryByRole,
  SelectorMatcherOptions,
} from "@testing-library/dom";

type RegisterFunctionReturn<TName extends string, TArgs extends any | any[]> = {
  [K in `get${TName}` | `getAll${TName}s`]: (
    container: HTMLElement,
    options?: TArgs
  ) => HTMLElement;
} & {
  [K in `find${TName}` | `findAll${TName}s`]: (
    container: HTMLElement,
    options?: TArgs
  ) => Promise<HTMLElement | null>;
} & {
  [K in `query${TName}` | `queryAll${TName}s`]: (
    container: HTMLElement,
    options?: TArgs
  ) => HTMLElement | null;
};

type RegisterFunctionDefaultArgs = {
  ByRole: ByRoleOptions;
  ByLabelText: SelectorMatcherOptions;
  ByDisplayValue: MatcherOptions;
};

type RegisterFunctionTypes =
  | "ByAltText"
  | "ByDisplayValue"
  | "ByLabelText"
  | "ByPlaceholderText"
  | "ByRole"
  | "ByText"
  | "ByTitle"
  | "ByTestId";

type ByRoleFunctionOptions<TArgs extends any | any[]> = {
  name: string;
  matcher: ByRoleMatcher;
  convertOptions?: (args?: TArgs) => ByRoleOptions;
};
type SelectorMatcherFunctionOptions<TArgs extends any | any[]> = {
  name: string;
  matcher: Matcher;
  convertOptions?: (args?: TArgs) => SelectorMatcherOptions;
};
type MatcherFunctionOptions<TArgs extends any | any[]> = {
  name: string;
  matcher: string;
  convertOptions?: (args?: TArgs) => MatcherOptions;
};

type RegisterFunctionOptions<
  TType extends RegisterFunctionTypes,
  TArgs extends any | any[]
> = TType extends "ByRole"
  ? ByRoleFunctionOptions<TArgs>
  : TType extends "ByLabelText"
  ? SelectorMatcherFunctionOptions<TArgs>
  : TType extends "ByAltText"
  ? SelectorMatcherFunctionOptions<TArgs>
  : TType extends "ByPlaceholderText"
  ? SelectorMatcherFunctionOptions<TArgs>
  : TType extends "ByText"
  ? SelectorMatcherFunctionOptions<TArgs>
  : TType extends "ByDisplayValue"
  ? MatcherFunctionOptions<TArgs>
  : never;

/* ---------------------------------- Main ---------------------------------- */
export const registerTestingFunction = <
  TType extends RegisterFunctionTypes,
  TName extends string,
  TArgs extends any | any[]
>(
  type: TType,
  options: RegisterFunctionOptions<TType, TArgs>
): RegisterFunctionReturn<TName, TArgs> => {
  switch (type) {
    case "ByRole":
      return getTestingFunctionsByRole(options as ByRoleFunctionOptions<TArgs>);
    case "ByAltText":
    case "ByLabelText":
    case "ByPlaceholderText":
    case "ByText":
      return getTestingFunctionsWithSelectorMatcherValue(
        options as SelectorMatcherFunctionOptions<TArgs>
      );
    case "ByDisplayValue":
    case "ByTitle":
    case "ByTestId":
      return getTestingFunctionsWithMatcherValue(
        options as MatcherFunctionOptions<TArgs>
      );
    default:
      throw new Error(`Unhandled type: ${type}`);
  }
};

/* --------------------------------- Helpers -------------------------------- */
const getTestingFunctionsByRole = <
  TName extends string,
  TArgs extends any | any[] = RegisterFunctionDefaultArgs["ByRole"]
>({
  name,
  matcher,
  convertOptions = (args?: TArgs) => args as ByRoleOptions,
}: RegisterFunctionOptions<"ByRole", TArgs>): RegisterFunctionReturn<
  TName,
  TArgs
> =>
  ({
    [`query${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      queryByRole(container, matcher, convertOptions(userOptions)),
    [`queryAll${name}s`]: (container: HTMLElement, userOptions?: TArgs) =>
      queryAllByRole(container, matcher, convertOptions(userOptions)),
    [`find${name}`]: async (container: HTMLElement, userOptions?: TArgs) =>
      await findByRole(container, matcher, convertOptions(userOptions)),
    [`findAll${name}s`]: async (container: HTMLElement, userOptions?: TArgs) =>
      await findAllByRole(container, matcher, convertOptions(userOptions)),
    [`get${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      getByRole(container, matcher, convertOptions(userOptions)),
    [`getAll${name}s`]: (container: HTMLElement, userOptions?: TArgs) =>
      getAllByRole(container, matcher, convertOptions(userOptions)),
  } as RegisterFunctionReturn<TName, TArgs>);

const getTestingFunctionsWithSelectorMatcherValue = <
  TName extends string,
  TArgs extends any | any[] = RegisterFunctionDefaultArgs["ByLabelText"]
>({
  name,
  matcher,
  convertOptions = (args?: TArgs) => args as SelectorMatcherOptions,
}: RegisterFunctionOptions<"ByLabelText", TArgs>): RegisterFunctionReturn<
  TName,
  TArgs
> =>
  ({
    [`query${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      queryByLabelText(container, matcher, convertOptions(userOptions)),
    [`queryAll${name}s`]: (container: HTMLElement, userOptions?: TArgs) =>
      queryAllByLabelText(container, matcher, convertOptions(userOptions)),
    [`find${name}`]: async (container: HTMLElement, userOptions?: TArgs) =>
      await findByLabelText(container, matcher, convertOptions(userOptions)),
    [`findAll${name}s`]: async (container: HTMLElement, userOptions?: TArgs) =>
      await findAllByLabelText(container, matcher, convertOptions(userOptions)),
    [`get${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      getByLabelText(container, matcher, convertOptions(userOptions)),
    [`getAll${name}s`]: (container: HTMLElement, userOptions?: TArgs) =>
      getAllByLabelText(container, matcher, convertOptions(userOptions)),
  } as RegisterFunctionReturn<TName, TArgs>);

const getTestingFunctionsWithMatcherValue = <
  TName extends string,
  TArgs extends any | any[] = RegisterFunctionDefaultArgs["ByDisplayValue"]
>({
  matcher,
  name,
  convertOptions = (args?: TArgs) => args as MatcherOptions,
}: RegisterFunctionOptions<"ByDisplayValue", TArgs>): RegisterFunctionReturn<
  TName,
  TArgs
> =>
  ({
    [`query${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      queryByDisplayValue(container, matcher, convertOptions(userOptions)),
    [`queryAll${name}s`]: (container: HTMLElement, userOptions?: TArgs) =>
      queryAllByDisplayValue(container, matcher, convertOptions(userOptions)),
    [`find${name}`]: async (container: HTMLElement, userOptions?: TArgs) =>
      await findByDisplayValue(container, matcher, convertOptions(userOptions)),
    [`findAll${name}s`]: async (container: HTMLElement, userOptions?: TArgs) =>
      await findAllByDisplayValue(
        container,
        matcher,
        convertOptions(userOptions)
      ),
    [`get${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      getByDisplayValue(container, matcher, convertOptions(userOptions)),
    [`getAll${name}s`]: (container: HTMLElement, userOptions?: TArgs) =>
      getAllByDisplayValue(container, matcher, convertOptions(userOptions)),
  } as RegisterFunctionReturn<TName, TArgs>);
