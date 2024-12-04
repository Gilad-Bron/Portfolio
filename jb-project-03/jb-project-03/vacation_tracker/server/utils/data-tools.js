
module.exports = {
	mergeUniqueVacations: (vacations) => {
		const vacationMap = {}
		vacations.forEach((vacation) => {
			if (!vacationMap[vacation.vacation_id]) {
				vacationMap[vacation.vacation_id] = {
					...vacation,
					user_ids: [vacation.user_id]
				};
			} else {
				vacationMap[vacation.vacation_id].user_ids.push(vacation.user_id)
			}
		})
		return Object.values(vacationMap)
	}
}