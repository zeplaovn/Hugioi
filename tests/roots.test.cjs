/* Linh căn: không còn tôi luyện, Hỗn Độn là sự kiện ẩn, chỉ còn nâng cấp hấp thụ linh khí. */
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const H = require('../engine/game.js');
const C = require('../engine/protocol/commands.js');

const NOW = 1800000000000;
const profile = { name: 'Lý Vô Thường', gender: 'nam', age: 18, race: 'nhan', roots: [72, 61, 45, 44, 33], rootType: 'Song', talent: { tuongMao: 2, phucDuyen: 2, canCot: 2, ngoTinh: 1, vanKhi: 1 }, destiny: 'exp' };
const newGame = () => new H.Game(H.createCharacter(profile, NOW, () => 0), () => 0);

test('không còn lệnh và trạng thái tôi luyện linh căn', () => {
  assert.ok(!C.types.includes('temperRoot'));
  assert.equal('rootCraft' in newGame().s, false);
  assert.equal(H.TEMPER_MAX, undefined);
});

test('bản lưu cũ có rootCraft vẫn tải được và bị bỏ trường đó', () => {
  const raw = JSON.parse(JSON.stringify(newGame().s));
  raw.rootCraft = { essence: [5, 5, 5, 5, 5], levels: [3, 3, 0, 0, 0] };
  assert.equal('rootCraft' in H.normalize(raw, NOW), false);
});

test('kho tông môn không còn bán Tinh hoa', () => {
  assert.ok(!H.SECT_SHOP.some(x => x.id === 'essence'));
});

test('chỉ nâng cấp tốc độ hấp thụ linh khí (chỉ mục 1), các chỉ mục cũ bị từ chối', () => {
  const g = newGame();
  g.s.stone = 1e30;
  assert.throws(() => g.upgrade({ index: 0, count: 1 }, NOW), /không hợp lệ/);
  assert.ok(g.upgrade({ index: 1, count: 1 }, NOW) >= 1);
});

test('mỗi hệ ngũ hành có thế mạnh nền dùng chung cho luật và giao diện', () => {
  assert.equal(H.ELEMENT_BASE.length, H.ELEMENT_NAMES.length);
  const g = newGame();
  assert.ok(g.rootEffects().attack > 0);
});

test('giao diện không tiết lộ cơ hội hay con đường Hỗn Độn', () => {
  const read = rel => fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
  for (const file of ['client/ui/screens/adventures.js', 'client/ui/screens/tribulation.js', 'client/ui/shell.js', 'client/ui/boot.js'])
    assert.doesNotMatch(read(file), /chaosChance|chaosTries|Cơ hội hóa Hỗn Độn/, file);
});
