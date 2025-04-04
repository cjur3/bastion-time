function differenceInDays(diff, secondsInDay, currentDaySeconds) {
    const dayChanged = (currentDaySeconds - diff) >= secondsInDay || (currentDaySeconds - diff) < 0;
    const overflow = diff % secondsInDay !== 0;
    const daysDifference = Math.round(diff / secondsInDay);
    console.log(diff, secondsInDay, currentDaySeconds, diff / secondsInDay, daysDifference);
    if (diff > 0) {
        return daysDifference + ((overflow && dayChanged) ? 1 : 0);
    } else {
        return daysDifference - ((overflow && dayChanged) ? 1 : 0);
    }
}


Hooks.on("ready", () => {
    console.log("initializing bastion time");
    Hooks.on(SimpleCalendar.Hooks.DateTimeChange, (data) => {
        const { date, diff } = data;
        const { time } = SimpleCalendar.api.getCurrentCalendar();
        const secondsInDay = time.secondsInMinute * time.minutesInHour * time.hoursInDay;
        const currentDaySeconds = date.hour * time.minutesInHour * time.secondsInMinute + date.minute * time.secondsInMinute + date.second;
    
        const difference = differenceInDays(diff, secondsInDay, currentDaySeconds);
        const playerActors = game.actors.filter(i => i.type === "character");
        playerActors.forEach(actor => {
            game.system.bastion.advanceAllFacilities(actor, { duration: difference })
        });
    });
})