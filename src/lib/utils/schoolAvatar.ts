export function getSchoolAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=020617&color=fff&size=512&bold=true&format=svg`;
}
