from typing import Type

from app.db.dals.base_dal import BaseDal
from app.db.tables.submissions import Submissions

class SubmissionsDal(BaseDal[Submissions]):
    @property
    def _table(self) -> Type[Submissions]:
        return Submissions
 