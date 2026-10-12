import { redirect } from '@sveltejs/kit';

/* the software page used to live at /projects; keep old links working */
export function load() {
	throw redirect(308, '/software');
}
