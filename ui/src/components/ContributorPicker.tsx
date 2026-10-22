import type { Contributor } from "../api/contributors";

function ContributorPicker({
  name,
  contributors,
  defaultValue,
  placeholder,
}: {
  name: string;
  contributors: Contributor[];
  defaultValue?: number;
  placeholder: string;
}) {
  return (
    <select name={name} defaultValue={defaultValue ?? ""}>
      <option value="">{placeholder}</option>
      {contributors.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

export default ContributorPicker;
