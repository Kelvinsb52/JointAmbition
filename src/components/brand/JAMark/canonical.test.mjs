import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getOuterConstruction, getSaturationStrokeWidth } from './constructionGeometry.ts';

const source = readFileSync(new URL('../../../assets/brand/joint-ambition-mark.master.svg', import.meta.url));

function outerPath(group) {
  const match = source.toString().match(new RegExp(`<g\\s+id="${group}">\\s*<path\\s+d="([^"]+)"`));
  assert.ok(match, `Missing canonical group ${group}`);
  return match[1];
}

test('canonical JA source remains byte-for-byte identical to the approved master', () => {
  assert.equal(
    createHash('sha256').update(source).digest('hex'),
    '8642608fdb2711c747f267abf7725f66c9eaa9e82508f084ab40b42007285ade',
    'Do not update this checksum to accommodate animation changes. The master is immutable.',
  );
});

test('incoming lines contact the exact near-side edges, never the center', () => {
  const left = getOuterConstruction(outerPath('pgl'), 'left');
  const right = getOuterConstruction(outerPath('pgr'), 'right');
  assert.equal(left.contact.y, 540);
  assert.equal(left.contact.x, 247 - (540 - 344) / (982 - 344));
  assert.equal(right.contact.x, 834);
  assert.equal(right.contact.y, 540);
  assert.ok(left.contact.x < 529 && right.contact.x > 552);
  assert.ok(Math.abs(left.forwardRailLength - Math.hypot(982 - 540, left.contact.x - 246)) < 1e-10);
  assert.equal(right.forwardRailLength, 195);
  for (const construction of [left, right]) {
    assert.equal(construction.forwardLength + construction.backwardLength, construction.perimeter);
    assert.ok(construction.forwardLength > construction.forwardRailLength);
    assert.ok(construction.backwardLength > construction.backwardRailLength);
  }
});

test('unified saturation thickness increases monotonically and closes the whole interior', () => {
  for (const [group, side] of [['pgl', 'left'], ['pgr', 'right']]) {
    const construction = getOuterConstruction(outerPath(group), side);
    assert.equal(getSaturationStrokeWidth(construction, 0), 0);
    let previous = 0;
    for (let step = 1; step <= 100; step++) {
      const width = getSaturationStrokeWidth(construction, step / 100);
      assert.ok(width > previous);
      previous = width;
    }
    assert.ok(previous > construction.bounds.maxX - construction.bounds.minX);
    for (const progress of [-.01, 1.01, NaN, Infinity]) {
      assert.throws(() => getSaturationStrokeWidth(construction, progress), RangeError);
    }
  }
});

test('unsupported source geometry is rejected, not approximated', () => {
  assert.throws(() => getOuterConstruction('M 0 0 C 1 2 3 4 5 6 Z', 'left'));
  assert.throws(() => getOuterConstruction('M 0 0 L 1 0 L 1 1', 'left'));
});
