export function calculateDays(
    startDate: Date | null,
    endDate: Date | null
): number {

    if (!startDate || !endDate) {
        return 0;
    }


    const start =
        new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
        );


    const end =
        new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
        );


    const difference =
        end.getTime() - start.getTime();


    const days =
        difference /
        (1000 * 60 * 60 * 24);


    return Math.max(
        days,
        1
    );

}