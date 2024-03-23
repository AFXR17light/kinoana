import { fileSource } from "../source";
import childDisplay from "../childDisplay";
import { source } from "../types";

interface group {
  year: string;
  items: source[];
}

const Archives = async ({ path }: { path?: string }) => {
  const pathFragments = path?.split('/').filter(fragment => fragment !== '');
  let originalSource = await fileSource();
  // get children of given path
  if (pathFragments) {
    let source = originalSource;
    for (const fragment of pathFragments) {
      source = source.children?.find(child => child.path.endsWith(fragment)) as source;
    }
    originalSource = source;
  }
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
  const sortedSource = flatSource.sort((a, b) => {
    // sort by time
    if (a.frontmatter?.date && b.frontmatter?.date) {
      // has date field first
      if (a.frontmatter.date > b.frontmatter.date) return -1;
      else if (a.frontmatter.date < b.frontmatter.date) return 1;
      else return 0;
    } else {
      // if no date, sort by name
      if (a.path < b.path) return -1;
      else if (a.path > b.path) return 1;
      else return 0;
    }
  });
  sortedSource.forEach(source => {
    let date;
    if (source.frontmatter?.date) {
      date = new Date(source.frontmatter.date);
    }
    // seperate year, month and date
    const year = date ? date.getFullYear().toString() : 'undefined';
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
  const sortedGroup = groupedItems.sort((a, b) => {
    if (a.year === 'undefined' && b.year !== 'undefined') return 1;
    else if (a.year !== 'undefined' && b.year === 'undefined') return -1;
    else if (a.year > b.year) return -1;
    else if (a.year < b.year) return 1;
    else return 0;
  });
  return (
    <>
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
        {sortedGroup.map(yearGroup => (
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
                {item.content && !item.children &&
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
                  </div>}
              </article>
            ))}
          </div>
        ))}
      </div>
      <div style={{ height: '30vh' }} />
    </>
  )
}

export default Archives
