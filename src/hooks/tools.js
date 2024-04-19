export const findEntryAndParentArray = (entries, sort) => {
    for (const entry of entries) {
        if (entry.sort === sort) {
            return { entry, parentArray: entries };
        }
        if (entry.contents) {
            const result = findEntryAndParentArray(entry.contents, sort);
            if (result) {
                return result;
            }
        }
    }
    return null;
};

export const addSortProperty = (entries) => {
    let index = 1;
    const recursiveAddSortProperty = (entry) => {
        if (entry.contents && entry.contents.length > 0) {
            entry.contents.forEach(recursiveAddSortProperty);
        }
        entry.sort = index++;
    };
    entries.forEach((entry) => {
        recursiveAddSortProperty(entry);
    });
};
