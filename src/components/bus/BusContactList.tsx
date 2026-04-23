type Contact = { team: string; phone: string; subLabel?: string };

// Rows of (team label + optional sub-label) on the left, phone number
// in blue accent on the right. Matches IMG_3785 and IMG_3789.
export default function BusContactList({
  contacts,
}: {
  contacts: Contact[];
}) {
  return (
    <ul className="flex flex-col divide-y divide-grey-200">
      {contacts.map((c) => (
        <li
          key={c.team}
          className="flex items-start justify-between gap-6 py-4"
        >
          <div className="min-w-0">
            <p className="text-t5 font-bold text-grey-900 leading-tight">
              {c.team}
            </p>
            {c.subLabel ? (
              <p className="text-t7 text-grey-500 mt-0.5">{c.subLabel}</p>
            ) : null}
          </div>
          <a
            href={`tel:${c.phone.replace(/-/g, "")}`}
            className="text-t5 font-bold text-blue-500 whitespace-nowrap hover:underline"
          >
            {c.phone}
          </a>
        </li>
      ))}
    </ul>
  );
}
