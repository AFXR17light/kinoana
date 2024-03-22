import { fileSource } from "../source";
import childDisplay from "../childDisplay";
import { source } from "../types";

interface group {
  year: string;
  items: source[];
}

const Archives = async () => {
  const originalSource = await fileSource();
  let groupedItems: group[] = [];
  const getFlatSource = (source: source): source[] => {
    const flatSource: source[] = [];
    if (source.children && !source.frontmatter?.hide) {
      source.children.forEach(child => {
        flatSource.push(child);
        flatSource.push(...getFlatSource(child));
      });
    }
    return flatSource;
  }
  const monthDate = (date: string | undefined) => {
    if (!date) return undefined;
    const dateObj = new Date(date);
    return `${(dateObj.getMonth() + 1)}-${dateObj.getDate()}`
  };
  const flatSource = getFlatSource(originalSource);
  flatSource.forEach(source => {
    if (!source.frontmatter?.date) return;
    const date = new Date(source.frontmatter.date);
    // seperate year, month and date
    const year = date.getFullYear().toString();
    // check if there is an object containing the same year
    const existingYearGroup = groupedItems.find(group => group.year === year);
    if (existingYearGroup) {
      // if the year already exists, add the month and date part to the existing object
      existingYearGroup.items.push(source);
    } else {
      // if the year does not exist, create a new object and add it to the array
      groupedItems.push({ year, items: [source] });
    }
  })
  return (
    <div
      style={{
        margin: '12% 0 0',
        position: 'relative',
      }}>
      <div style={{ // timeline
        borderLeft: '.2em solid var(--normal)',
        position: 'absolute',
        top: '1em',
        left: '0',
        height: '100%',
      }} />
      {groupedItems.map(yearGroup => (
        <div key={yearGroup.year}>
          <div style={{ // year
            margin: '3em 0' // up down / leaf right
          }}>
            <span style={{
              margin: '1em',
              fontWeight: 'bold',
              fontSize: '1.25em',
              color: 'var(--grey)',
              position: 'relative',
            }}>
              <span style={{ // year dot: back
                position: 'absolute',
                top: '.4em',
                left: '-1.225em',
                width: '0.6em',
                height: '0.6em',
                backgroundColor: 'var(--normal)',
                borderRadius: '50%',
              }} />
              <span style={{ // year dot: front
                position: 'absolute',
                top: '.5em',
                left: '-1.125em',
                width: '0.4em',
                height: '0.4em',
                backgroundColor: 'var(--grey)',
                borderRadius: '50%',
              }} />
              {yearGroup.year}
            </span>
          </div>
          {yearGroup.items.map(item => ( // each item
            <article key={item.path}>
              <div style={{ borderBottom: '1px solid var(--border)', margin: '1.75em 0 .5em 0.2em', position: 'relative', transition: 'all .2s ease-in-out' }}>
                <span style={{ // item dot: back
                  position: 'absolute',
                  top: '.40em',
                  left: '-.35em',
                  width: '0.5em',
                  height: '0.5em',
                  backgroundColor: 'var(--normal)',
                  borderRadius: '50%',
                }} />
                <span style={{ // item dot: front
                  position: 'absolute',
                  top: '.5em',
                  left: '-.25em',
                  width: '0.3em',
                  height: '0.3em',
                  backgroundColor: 'var(--grey)',
                  borderRadius: '50%',
                }} />
                <div>
                  <span style={{ // date
                    color: 'var(--grey)',
                    fontFamily: 'Times, SimSun, serif',
                    margin: '0 .7em 0 .85em',
                  }}>{monthDate(item.frontmatter?.date)}</span>
                  {childDisplay(item, 'title')}
                </div>
              </div>
            </article>
          ))
          }
        </div>
      ))
      }
    </div>
  )
}

export default Archives
