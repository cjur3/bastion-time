function differenceInDays(diff, secondsInDay, currentDaySeconds) {
    const dayChanged = (currentDaySeconds - diff) >= secondsInDay || (currentDaySeconds - diff) < 0;
    const overflow = diff % secondsInDay !== 0;
    const daysDifference = Math.round(diff / secondsInDay);

    if (diff > 0) {
        return daysDifference + ((overflow && dayChanged) ? 1 : 0);
    } else {
        return daysDifference - ((overflow && dayChanged) ? 1 : 0);
    }
}

function areRequirementsForBastionProgressMet(actor) {
    if (actor.type !== "character") {
        return false;
    }

    if (actor.system && actor.system.details && actor.system.details.level < 5) {
        return false;
    }

    if (actor.items) {
        const facilities = actor.items.filter(i => i.type === "facility");

        for (facilityId in facilities) {
            const facility = facilities[facilityId];

            if (facility.system) {
                const { building, progress } = facility.system;

                if (progress && progress.max) {
                    return true;
                }
            }
        }

    }

    return false;
}

Hooks.on("ready", () => {
    console.log("initializing bastion time");
    const turnDuration = game.settings.get("dnd5e", "bastionConfiguration").duration;
    Hooks.on(SimpleCalendar.Hooks.DateTimeChange, (data) => {
        const { date, diff } = data;
        const { time } = SimpleCalendar.api.getCurrentCalendar();
        const secondsInDay = time.secondsInMinute * time.minutesInHour * time.hoursInDay;
        const currentDaySeconds = date.hour * time.minutesInHour * time.secondsInMinute + date.minute * time.secondsInMinute + date.second;

        const difference = differenceInDays(diff, secondsInDay, currentDaySeconds);
        const playerActors = game.actors.filter(areRequirementsForBastionProgressMet);
        if(difference >= turnDuration || difference <= -turnDuration) { 
            playerActors.forEach(actor => {
                game.system.bastion.advanceAllFacilities(actor, { duration: difference })
            });
        }
    });
})