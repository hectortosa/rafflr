import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LitElement } from 'lit';
import { SaveController } from '../save-controller';

class FakeHost extends LitElement {}
customElements.define('fake-host', FakeHost);

describe('SaveController', () => {
    let writeText: ReturnType<typeof vi.fn>;
    let host: FakeHost;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        writeText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText },
            configurable: true,
        });
        host = new FakeHost();
        dispatchSpy = vi.spyOn(host, 'dispatchEvent');
    });

    it('writes a URL with array values joined by ;', async () => {
        const controller = new SaveController(host, 'lucky-one');
        await controller.save({ participants: ['a', 'b', 'c'] });
        expect(writeText).toHaveBeenCalledTimes(1);
        const url = writeText.mock.calls[0][0] as string;
        expect(url).toContain('/lucky-one?');
        expect(url).toContain('participants=a%3Bb%3Bc');
    });

    it('serializes scalar and boolean values', async () => {
        const controller = new SaveController(host, 'dice-roll');
        await controller.save({ removePick: true, useTickets: false });
        const url = writeText.mock.calls[0][0] as string;
        expect(url).toContain('removePick=true');
        expect(url).toContain('useTickets=false');
    });

    it('dispatches a setup-saved event after copying', async () => {
        const controller = new SaveController(host, 'lucky-one');
        await controller.save({ participants: ['a'] });
        expect(dispatchSpy).toHaveBeenCalled();
        const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
        expect(event.type).toBe('setup-saved');
        expect(event.detail.message).toContain('clipboard');
    });
});
