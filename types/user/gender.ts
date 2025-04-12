export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNSPECIFIED = "UNSPECIFIED",
}

export const genderOptions = [
  { label: "Male", value: Gender.MALE },
  { label: "Female", value: Gender.FEMALE },
  { label: undefined, value: Gender.UNSPECIFIED },
];
