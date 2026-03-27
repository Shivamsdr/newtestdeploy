/**
 * TourTimeline Component
 *
 * Vertical timeline for tour steps. Reusable across public pages.
 *
 * @param {Object} props - Component props
 * @param {Array} props.steps - Array of timeline steps
 * @param {string} props.steps[].title - Step title (required)
 * @param {string} props.steps[].description - Step description (optional)
 * @param {string} props.steps[].duration - Step duration (optional)
 * @param {string} props.steps[].image - Step image URL (optional)
 * @param {number} props.steps[].order - Step order (optional, falls back to index + 1)
 */
const TourTimeline = ({ steps = [] }) => {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 ">
        No timeline steps available
      </div>
    );
  }

  return (
    <div className="relative" role="list" aria-label="Tour timeline">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 " aria-hidden="true" />

      {steps.map((step, index) => (
        <div key={step._id ?? index} className="relative flex gap-4 pb-8 last:pb-0" role="listitem">
          <div
            className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg"
            aria-label={`Step ${step.order ?? index + 1}`}
          >
            {step.order ?? index + 1}
          </div>

          <div className="flex-1 pt-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 mb-2">
              <h3 className="font-semibold text-gray-800  text-xl">
                {step.title}
              </h3>
              {step.duration && (
                <span className="text-sm px-3 py-1 bg-blue-100  text-blue-700  rounded-full font-medium">
                  {step.duration}
                </span>
              )}
            </div>
            {step.description && (
              <p className="text-gray-600  leading-relaxed">
                {step.description}
              </p>
            )}
            {step.image && (
              <img
                src={step.image}
                alt={step.title}
                className="mt-4 rounded-xl max-w-md h-48 object-cover"
                loading="lazy"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TourTimeline;
