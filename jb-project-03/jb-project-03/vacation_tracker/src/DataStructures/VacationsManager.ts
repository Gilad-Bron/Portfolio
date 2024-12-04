import {Vacation} from '../types'

export enum SortTypes {
  Date = 'Date',
  Price = 'Price',
  Destination = 'Destination',
}

export enum FilterTypes {
  All = "All Destinations",
  Favorites = "Favorite Destinations"
}

type VacationsSortFunction = (vacations: Vacation[]) => Vacation[];

const sortFunctionsMap: Record<SortTypes, VacationsSortFunction> = {
  [SortTypes.Date]: (vacations: Vacation[]) => vacations?.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()),
  [SortTypes.Price]: (vacations: Vacation[]) => vacations?.sort((a, b) => a.price - b.price),
  [SortTypes.Destination]: (vacations: Vacation[]) => vacations?.sort((a, b) => a.destination.localeCompare(b.destination))
};


export class VacationsManager {
  private vacations: Vacation[] = []

  loadVacations(vacations?: Vacation[]) {
    this.vacations = vacations
  }

  public sort(sortType: SortTypes): Vacation[] {
    return [...sortFunctionsMap[sortType](this.vacations)]
  }

  public filter(filterType: FilterTypes, userId: number): Vacation[] {
    if (filterType === FilterTypes.All) {
      return this.vacations
    } else if (filterType === FilterTypes.Favorites) {
      return this.vacations.filter((vacation) => vacation.user_ids?.includes(userId))
    }
  }
}
