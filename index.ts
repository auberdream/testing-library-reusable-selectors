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

type GenerateFunctionReturn<TName extends string, TArgs extends any | any[]> = {
  [K in `get${TName}` | `getAll${TName}`]: (
    container: HTMLElement,
    options?: TArgs
  ) => HTMLElement;
} & {
  [K in `find${TName}` | `findAll${TName}`]: (
    container: HTMLElement,
    options?: TArgs
  ) => Promise<HTMLElement | null>;
} & {
  [K in `query${TName}` | `queryAll${TName}`]: (
    container: HTMLElement,
    options?: TArgs
  ) => HTMLElement | null;
};

type GenerateFunctionDefaultArgs = {
  ByRole: ByRoleOptions;
  ByLabelText: SelectorMatcherOptions;
  ByDisplayValue: MatcherOptions;
};

type GenerateFunctionTypes =
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

type GenerateFunctionOptions<
  TType extends GenerateFunctionTypes,
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

/**
 *@description a function that creates 6 functions so that selectors are reusable but dynamic enough to add options or custom arguments
 *
 * @param type the type of matcher, eg 'ByRole' | 'ByLabelText' | 'ByText'
 * @param options an object that contains the name of the function, the first argument of that function (the matcher)
 * and a function to convert the second argument of the function to the correct type
 * @returns 6 functions that match the RTL API but the functions are suffixed by the name of the function (defined in
 * the options)
 *
 * @example
 * ```
 * const { queryButton, queryAllButton, find..., get...} = registerTestingFunction('ByRole', { name: 'Button', matcher: 'button' })
 * queryButton({ name: 'my button name' }) // note the arguments default to the options defined in the ByRole function from RTL
 *
 * const { queryAnotherButton, ...rest} = registerTestingFunction('ByRole', { name: 'AnotherButton', matcher: 'button', convertOptions: (name: string) => ({ name }) })
 * queryAnotherButton('another button name') // note the arguments changed by convertOptions
 * ```
 *
 */
export const generateTestingFunctions = <
  TType extends GenerateFunctionTypes,
  TName extends string,
  TArgs extends any | any[]
>(
  type: TType,
  options: GenerateFunctionOptions<TType, TArgs>
): GenerateFunctionReturn<TName, TArgs> => {
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
  TArgs extends any | any[] = GenerateFunctionDefaultArgs["ByRole"]
>({
  name,
  matcher,
  convertOptions = (args?: TArgs) => args as ByRoleOptions,
}: GenerateFunctionOptions<"ByRole", TArgs>): GenerateFunctionReturn<
  TName,
  TArgs
> =>
  ({
    [`query${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      queryByRole(container, matcher, convertOptions(userOptions)),
    [`queryAll${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      queryAllByRole(container, matcher, convertOptions(userOptions)),
    [`find${name}`]: async (container: HTMLElement, userOptions?: TArgs) =>
      await findByRole(container, matcher, convertOptions(userOptions)),
    [`findAll${name}`]: async (container: HTMLElement, userOptions?: TArgs) =>
      await findAllByRole(container, matcher, convertOptions(userOptions)),
    [`get${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      getByRole(container, matcher, convertOptions(userOptions)),
    [`getAll${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      getAllByRole(container, matcher, convertOptions(userOptions)),
  } as GenerateFunctionReturn<TName, TArgs>);

const getTestingFunctionsWithSelectorMatcherValue = <
  TName extends string,
  TArgs extends any | any[] = GenerateFunctionDefaultArgs["ByLabelText"]
>({
  name,
  matcher,
  convertOptions = (args?: TArgs) => args as SelectorMatcherOptions,
}: GenerateFunctionOptions<"ByLabelText", TArgs>): GenerateFunctionReturn<
  TName,
  TArgs
> =>
  ({
    [`query${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      queryByLabelText(container, matcher, convertOptions(userOptions)),
    [`queryAll${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      queryAllByLabelText(container, matcher, convertOptions(userOptions)),
    [`find${name}`]: async (container: HTMLElement, userOptions?: TArgs) =>
      await findByLabelText(container, matcher, convertOptions(userOptions)),
    [`findAll${name}`]: async (container: HTMLElement, userOptions?: TArgs) =>
      await findAllByLabelText(container, matcher, convertOptions(userOptions)),
    [`get${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      getByLabelText(container, matcher, convertOptions(userOptions)),
    [`getAll${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      getAllByLabelText(container, matcher, convertOptions(userOptions)),
  } as GenerateFunctionReturn<TName, TArgs>);

const getTestingFunctionsWithMatcherValue = <
  TName extends string,
  TArgs extends any | any[] = GenerateFunctionDefaultArgs["ByDisplayValue"]
>({
  matcher,
  name,
  convertOptions = (args?: TArgs) => args as MatcherOptions,
}: GenerateFunctionOptions<"ByDisplayValue", TArgs>): GenerateFunctionReturn<
  TName,
  TArgs
> =>
  ({
    [`query${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      queryByDisplayValue(container, matcher, convertOptions(userOptions)),
    [`queryAll${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      queryAllByDisplayValue(container, matcher, convertOptions(userOptions)),
    [`find${name}`]: async (container: HTMLElement, userOptions?: TArgs) =>
      await findByDisplayValue(container, matcher, convertOptions(userOptions)),
    [`findAll${name}`]: async (container: HTMLElement, userOptions?: TArgs) =>
      await findAllByDisplayValue(
        container,
        matcher,
        convertOptions(userOptions)
      ),
    [`get${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      getByDisplayValue(container, matcher, convertOptions(userOptions)),
    [`getAll${name}`]: (container: HTMLElement, userOptions?: TArgs) =>
      getAllByDisplayValue(container, matcher, convertOptions(userOptions)),
  } as GenerateFunctionReturn<TName, TArgs>);
