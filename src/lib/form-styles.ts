export const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238F8279' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

export const inputClasses = (hasError: boolean): string =>
  `w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
    hasError ? "border-err" : "border-border"
  }`;

export const selectClasses = (hasError: boolean): string =>
  `w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans cursor-pointer transition-[border-color,background,box-shadow] duration-150 ease-out pr-9 appearance-none focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 ${
    hasError ? "border-err" : "border-border"
  }`;
