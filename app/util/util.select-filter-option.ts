export const utilSelectFilterOption = (search: string, option: any) => {
    return (option.label.toLowerCase()).includes(search.toLowerCase());
};
